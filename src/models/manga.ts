// models/manga.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IManga extends Document {
    title: string;
    slug: string;
    altTitles: string[];
    description: string;
    authors: mongoose.Types.ObjectId[];
    artists: mongoose.Types.ObjectId[];
    status: 'ongoing' | 'completed' | 'hiatus' | 'canceled';
    genres: mongoose.Types.ObjectId[];
    chapters: mongoose.Types.ObjectId[];
    coverImage: string;
    contentRating: 'safe' | 'suggestive' | 'erotica' | 'pornographic';
    views: number;
    lastPublished?: Date;
}

const MangaSchema: Schema = new Schema({
    title: { type: String, required: true, index: 'text' },
    slug: { type: String, unique: true, index: true },
    altTitles: [{ type: String }],
    description: { type: String, required: true },
    authors: [{ type: Schema.Types.ObjectId, ref: 'Creator', required: true }],
    artists: [{ type: Schema.Types.ObjectId, ref: 'Creator' }],
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'hiatus', 'canceled'],
        default: 'ongoing'
    },
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
    chapters: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }],
    coverImage: { type: String, required: true },
    contentRating: {
        type: String,
        enum: ['safe', 'suggestive', 'erotica', 'pornographic'],
        default: 'safe'
    },
    views: { type: Number, default: 0 },
    lastPublished: Date
}, { timestamps: true });

// Slug generation hook
MangaSchema.pre<IManga>('save', function(next) {
    if (!this.isModified('title')) return next();
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

// Indexes
MangaSchema.index({ title: 'text', altTitles: 'text' });
MangaSchema.index({ status: 1 });
MangaSchema.index({ 'genres': 1 });

export const Manga = mongoose.model<IManga>('Manga', MangaSchema);
