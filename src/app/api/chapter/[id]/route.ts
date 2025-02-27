// app/api/chapter/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Chapter from '@/models/Chapter';
import Page from '@/models/Page';
import Manga from '@/models/Manga';
import History from '@/models/History';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return NextResponse.json({ error: 'Invalid chapter ID' }, { status: 400 });
        }

        const chapter = await Chapter.findById(params.id);

        if (!chapter) {
            return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
        }

        // Increment view count
        await Chapter.findByIdAndUpdate(chapter._id, { $inc: { views: 1 } });

        // Get pages
        const pages = await Page.find({ chapter: chapter._id })
            .sort({ number: 1 })
            .select('number image width height');

        // Get next and previous chapters
        const manga = await Manga.findById(chapter.manga).select('title slug');
        const [prevChapter, nextChapter] = await Promise.all([
            Chapter.findOne({
                manga: chapter.manga,
                number: { $lt: chapter.number }
            })
                .sort({ number: -1 })
                .select('_id number')
                .lean(),

            Chapter.findOne({
                manga: chapter.manga,
                number: { $gt: chapter.number }
            })
                .sort({ number: 1 })
                .select('_id number')
                .lean()
        ]);

        // Record history if user is logged in
        if (session && session.user.id) {
            await History.findOneAndUpdate(
                {
                    user: session.user.id,
                    manga: chapter.manga,
                    chapter: chapter._id
                },
                {
                    user: session.user.id,
                    manga: chapter.manga,
                    chapter: chapter._id,
                    page: 1,
                    readAt: new Date()
                },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({
            chapter,
            manga,
            pages,
            navigation: {
                prev: prevChapter,
                next: nextChapter
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin-only update chapter
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const chapter = await Chapter.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!chapter) {
            return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
        }

        return NextResponse.json(chapter);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
