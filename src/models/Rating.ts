// models/Rating.ts
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IRating {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    manga: mongoose.Types.ObjectId;
    value: number;
    createdAt: Date;
    updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        manga: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
        value: { type: Number, required: true, min: 1, max: 5 }
    },
    { timestamps: true }
);

// Each user can rate a manga only once
RatingSchema.index({ user: 1, manga: 1 }, { unique: true });

// Middleware to update manga rating when a new rating is added
RatingSchema.post('save', async function(doc) {
    try {
        const Manga = mongoose.model('Manga');

        // Calculate new average
        const result = await mongoose.model('Rating').aggregate([
            { $match: { manga: doc.manga } },
            { $group: { _id: null, avg: { $avg: '$value' }, count: { $sum: 1 } } }
        ]);

        if (result.length > 0) {
            await Manga.findByIdAndUpdate(doc.manga, {
                'rating.average': result[0].avg,
                'rating.count': result[0].count
            });
        }
    } catch (error) {
        console.error('Error updating manga rating:', error);
    }
});

const Rating = (mongoose.models.Rating as Model<IRating>) || model<IRating>('Rating', RatingSchema);

export default Rating;
