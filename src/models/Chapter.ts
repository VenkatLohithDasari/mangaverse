// models/Chapter.ts
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IChapter {
    _id: mongoose.Types.ObjectId;
    manga: mongoose.Types.ObjectId;
    number: number;
    title?: string;
    pages: number;
    views: number;
    releasedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
    {
        manga: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
        number: { type: Number, required: true },
        title: String,
        pages: { type: Number, required: true, min: 1 },
        views: { type: Number, default: 0 },
        releasedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// Compound index for efficient chapter lookup
ChapterSchema.index({ manga: 1, number: 1 }, { unique: true });

const Chapter = (mongoose.models.Chapter as Model<IChapter>) || model<IChapter>('Chapter', ChapterSchema);

export default Chapter;
