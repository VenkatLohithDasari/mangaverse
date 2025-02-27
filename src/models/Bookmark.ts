// models/Bookmark.ts
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IBookmark {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    manga: mongoose.Types.ObjectId;
    chapter: mongoose.Types.ObjectId;
    page: number;
    createdAt: Date;
    updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        manga: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
        chapter: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
        page: { type: Number, required: true, default: 1 }
    },
    { timestamps: true }
);

// Each user can have only one bookmark per manga
BookmarkSchema.index({ user: 1, manga: 1 }, { unique: true });

const Bookmark = (mongoose.models.Bookmark as Model<IBookmark>) || model<IBookmark>('Bookmark', BookmarkSchema);

export default Bookmark;
