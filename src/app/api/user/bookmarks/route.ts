// app/api/user/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Bookmark from '@/models/Bookmark';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const bookmarks = await Bookmark.find({ user: session.user.id })
            .populate('manga', 'title slug coverImage')
            .populate('chapter', 'number title')
            .sort({ updatedAt: -1 });

        return NextResponse.json({ bookmarks });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Create or update bookmark
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { mangaId, chapterId, page } = body;

        if (!mangaId || !chapterId || !page) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create or update bookmark
        const bookmark = await Bookmark.findOneAndUpdate(
            {
                user: session.user.id,
                manga: new mongoose.Types.ObjectId(mangaId)
            },
            {
                user: session.user.id,
                manga: mangaId,
                chapter: chapterId,
                page: page
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ bookmark });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
