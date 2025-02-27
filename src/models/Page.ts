// models/Page.ts
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IPage {
    _id: mongoose.Types.ObjectId;
    chapter: mongoose.Types.ObjectId;
    number: number;
    image: string;
    width?: number;
    height?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
    {
        chapter: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
        number: { type: Number, required: true },
        image: { type: String, required: true },
        width: Number,
        height: Number
    },
    { timestamps: true }
);

// Compound index for efficient page lookup
PageSchema.index({ chapter: 1, number: 1 }, { unique: true });

const Page = (mongoose.models.Page as Model<IPage>) || model<IPage>('Page', PageSchema);

export default Page;
