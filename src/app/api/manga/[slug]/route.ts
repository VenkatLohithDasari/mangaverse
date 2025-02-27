// app/api/manga/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Manga from '@/models/Manga';
import Chapter from '@/models/Chapter';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Favorite from '@/models/Favorite';
import Rating from '@/models/Rating';
import Bookmark from '@/models/Bookmark';

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        const manga = await Manga.findOne({ slug: params.slug });

        if (!manga) {
            return NextResponse.json({ error: 'Manga not found' }, { status: 404 });
        }

        // Increment view count
        await Manga.findByIdAndUpdate(manga._id, { $inc: { views: 1 } });

        // Get chapters
        const chapters = await Chapter.find({ manga: manga._id })
            .sort({ number: -1 })
            .select('number title pages views releasedAt');

        // User-specific data if logged in
        let userRelation = null;
        if (session && session.user.id) {
            const userId = session.user.id;

            const [isFavorited, userRating, userBookmark] = await Promise.all([
                Favorite.findOne({ user: userId, manga: manga._id }).lean(),
                Rating.findOne({ user: userId, manga: manga._id }).lean(),
                Bookmark.findOne({ user: userId, manga: manga._id })
                    .populate('chapter', 'number title')
                    .lean()
            ]);

            userRelation = {
                isFavorited: !!isFavorited,
                rating: userRating ? userRating.value : null,
                bookmark: userBookmark
            };
        }

        return NextResponse.json({
            manga,
            chapters,
            userRelation
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Admin-only update manga
export async function PUT(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const manga = await Manga.findOneAndUpdate(
            { slug: params.slug },
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!manga) {
            return NextResponse.json({ error: 'Manga not found' }, { status: 404 });
        }

        return NextResponse.json(manga);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
