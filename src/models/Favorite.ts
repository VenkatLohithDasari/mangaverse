// models/Favorite.ts
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IFavorite {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    manga: mongoose.Types.ObjectId;
    createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        manga: { type: Schema.Types.ObjectId, ref: 'Manga', required: true }
    },
    { timestamps: true }
);

// Each user can favorite a manga only once
FavoriteSchema.index({ user: 1, manga: 1 }, { unique: true });

// Increment favorite count when a favorite is added
FavoriteSchema.post('save', async function(doc) {
    try {
        await mongoose.model('Manga').findByIdAndUpdate(
            doc.manga,
            { $inc: { favoriteCount: 1 } }
        );
    } catch (error) {
        console.error('Error incrementing favorite count:', error);
    }
});

// Decrement favorite count when a favorite is removed
FavoriteSchema.post('deleteOne', { document: true, query: false }, async function() {
    try {
        await mongoose.model('Manga').findByIdAndUpdate(
            this.manga,
            { $inc: { favoriteCount: -1 } }
        );
    } catch (error) {
        console.error('Error decrementing favorite count:', error);
    }
});

const Favorite = (mongoose.models.Favorite as Model<IFavorite>) || model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;
