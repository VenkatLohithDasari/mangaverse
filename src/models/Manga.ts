// models/Manga.ts
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IManga {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    altTitles?: string[];
    description?: string;
    coverImage: string;
    bannerImage?: string;     // Added banner image
    artist?: string;
    author?: string;
    status: 'ongoing' | 'completed' | 'hiatus';
    genres: string[];
    tags: string[];           // Added tags for themes, etc.
    rating: {
        average: number;
        count: number;
    };
    favoriteCount: number;
    views: number;
    isNSFW: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MangaSchema = new Schema<IManga>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        altTitles: [String],
        description: String,
        coverImage: { type: String, required: true },
        bannerImage: String,
        artist: String,
        author: String,
        status: {
            type: String,
            enum: ['ongoing', 'completed', 'hiatus'],
            default: 'ongoing'
        },
        genres: [String],
        tags: [String],
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0, min: 0 }
        },
        favoriteCount: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        isNSFW: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// Indexes for efficient queries
MangaSchema.index({ slug: 1 }, { unique: true });
MangaSchema.index({ genres: 1 });
MangaSchema.index({ tags: 1 });
MangaSchema.index({ title: 'text', altTitles: 'text', description: 'text' });

const Manga = (mongoose.models.Manga as Model<IManga>) || model<IManga>('Manga', MangaSchema);

export default Manga;
