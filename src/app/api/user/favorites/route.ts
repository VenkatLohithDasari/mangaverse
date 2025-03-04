// app/api/user/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Favorite from '@/models/Favorite';
import Manga from '@/models/Manga';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const mangaId = searchParams.get('mangaId');

        if (mangaId) {
            // Check if specific manga is favorited
            const favorite = await Favorite.findOne({
                user: session.user.id,
                manga: mangaId
            });

            return NextResponse.json({ isFavorite: !!favorite });
        } else {
            // Get all favorited manga
            const favorites = await Favorite.find({ user: session.user.id })
                .populate('manga', 'title slug coverImage status')
                .sort({ createdAt: -1 });

            return NextResponse.json({ favorites });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
