// app/api/user/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import History from '@/models/History';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '20');

        const history = await History.find({ user: session.user.id })
            .populate('manga', 'title slug coverImage')
            .populate('chapter', 'number title')
            .sort({ readAt: -1 })
            .limit(limit);

        return NextResponse.json({ history });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Update history entry
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

        // Create or update history entry
        const history = await History.findOneAndUpdate(
            {
                user: session.user.id,
                manga: mangaId,
                chapter: chapterId
            },
            {
                user: session.user.id,
                manga: mangaId,
                chapter: chapterId,
                page: page,
                readAt: new Date()
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ history });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
