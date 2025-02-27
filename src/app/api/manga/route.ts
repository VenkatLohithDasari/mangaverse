// app/api/manga/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Manga from '@/models/Manga';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const genres = searchParams.get('genres')?.split(',');
        const tags = searchParams.get('tags')?.split(',');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const sort = searchParams.get('sort') || 'updatedAt';

        // Build query
        const query: any = {};

        if (genres && genres.length > 0) {
            query.genres = { $all: genres };
        }

        if (tags && tags.length > 0) {
            query.tags = { $all: tags };
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Build sort
        let sortOption: any = {};
        switch (sort) {
            case 'title':
                sortOption = { title: 1 };
                break;
            case 'popular':
                sortOption = { views: -1 };
                break;
            case 'latest':
                sortOption = { createdAt: -1 };
                break;
            case 'rating':
                sortOption = { 'rating.average': -1 };
                break;
            case 'favorites':
                sortOption = { favoriteCount: -1 };
                break;
            case 'updatedAt':
            default:
                sortOption = { updatedAt: -1 };
                break;
        }

        const skip = (page - 1) * limit;

        const [manga, total] = await Promise.all([
            Manga.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .select('title slug coverImage status genres tags rating favoriteCount'),
            Manga.countDocuments(query)
        ]);

        return NextResponse.json({
            manga,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const manga = await Manga.create(body);

        return NextResponse.json(manga, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
