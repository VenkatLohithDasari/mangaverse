// models/chapter.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
    mangaId: mongoose.Types.ObjectId;
    chapterNumber: number;
    title?: string;
    pages: string[];
    views: number;
}

const ChapterSchema: Schema = new Schema({
    mangaId: {
        type: Schema.Types.ObjectId,
        ref: 'Manga',
        required: true,
        index: true
    },
    chapterNumber: { type: Number, required: true },
    title: String,
    pages: [{ type: String, required: true }],
    views: { type: Number, default: 0 }
}, { timestamps: true });

// Compound index to prevent duplicate chapters
ChapterSchema.index({ mangaId: 1, chapterNumber: 1 }, { unique: true });

export const Chapter = mongoose.model<IChapter>('Chapter', ChapterSchema);
