// app/api/manga/id/[id]/rating/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Rating from '@/models/Rating';
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

        const body = await req.json();
        const { value } = body;

        if (!value || value < 1 || value > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Add/update rating
        await Rating.findOneAndUpdate(
            {
                user: new mongoose.Types.ObjectId(session.user.id),
                manga: new mongoose.Types.ObjectId(params.id)
            },
            {
                $set: {
                    user: session.user.id,
                    manga: params.id,
                    value
                }
            },
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

        // Remove rating
        await Rating.deleteOne({
            user: new mongoose.Types.ObjectId(session.user.id),
            manga: new mongoose.Types.ObjectId(params.id)
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
