// models/User.ts (extending your existing model)
import mongoose, { Schema, model, Model } from 'mongoose';

export interface IUser {
    _id: mongoose.Types.ObjectId;
    name?: string;
    email?: string;
    image?: string;
    emailVerified?: Date;
    discordId: string;
    username: string;
    discriminator?: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: String,
        email: String,
        image: String,
        emailVerified: Date,
        discordId: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        discriminator: String,
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    { timestamps: true }
);

// Prevent model overwrite error in Next.js development mode
const User = (mongoose.models.User as Model<IUser>) || model<IUser>('User', UserSchema);

export default User;
