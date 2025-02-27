// models/History.ts
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IHistory {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    manga: mongoose.Types.ObjectId;
    chapter: mongoose.Types.ObjectId;
    page: number;
    readAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const HistorySchema = new Schema<IHistory>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        manga: { type: Schema.Types.ObjectId, ref: 'Manga', required: true },
        chapter: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
        page: { type: Number, required: true },
        readAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// Indexes for efficient queries
HistorySchema.index({ user: 1, manga: 1 });
HistorySchema.index({ user: 1, readAt: -1 });
// TTL index to automatically remove old history (180 days = ~15,552,000 seconds)
HistorySchema.index({ readAt: 1 }, { expireAfterSeconds: 15552000 });

const History = (mongoose.models.History as Model<IHistory>) || model<IHistory>('History', HistorySchema);

export default History;
