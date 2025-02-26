// models/genre.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IGenre extends Document {
    name: string;
    slug: string;
    description?: string;
}

const GenreSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
    description: String
});

// Slug generation
GenreSchema.pre<IGenre>('save', function(next) {
    if (!this.isModified('name')) return next();
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

export const Genre = mongoose.model<IGenre>('Genre', GenreSchema);
