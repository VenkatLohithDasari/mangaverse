// app/api/manga/id/[id]/favorite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Favorite from '@/models/Favorite';
import mongoose from 'mongoose';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Add to favorites
        await Favorite.findOneAndUpdate(
            {
                user: new mongoose.Types.ObjectId(session.user.id),
                manga: new mongoose.Types.ObjectId(params.id)
            },
            { $set: { user: session.user.id, manga: params.id } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Remove from favorites
        await Favorite.deleteOne({
            user: new mongoose.Types.ObjectId(session.user.id),
            manga: new mongoose.Types.ObjectId(params.id)
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
