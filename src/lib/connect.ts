import mongoose from 'mongoose';

declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

// Initialize the global mongoose object if it doesn't exist
if (!global.mongoose) {
    global.mongoose = {
        conn: null,
        promise: null,
    };
}

export async function connectToDB() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is missing in environment variables');
    }

    /**
     * If we already have a connection, return it
     * This prevents multiple connections in development due to hot reloading
     */
    if (global.mongoose.conn) {
        console.log('Using existing MongoDB connection');
        return global.mongoose.conn;
    }

    /**
     * If a connection is being established, return the promise
     * This prevents multiple connection attempts if many requests come in at once
     */
    if (!global.mongoose.promise) {
        const opts = {
            bufferCommands: false,
            // You can add more mongoose options here
        };

        global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI, opts);
    }

    try {
        // Await the connection
        global.mongoose.conn = await global.mongoose.promise;
        console.log('New MongoDB connection established');
        return global.mongoose.conn;
    } catch (error) {
        global.mongoose.promise = null;
        throw error;
    }
}

// Utility function to disconnect (useful for testing)
export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        global.mongoose.conn = null;
        global.mongoose.promise = null;
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('MongoDB disconnection error:', error);
        throw error;
    }
}
