// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export const authOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: 'identify email' } },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the Discord access token to the token
            if (account) {
                token.accessToken = account.access_token;
                token.id = account.providerAccountId;
            }
            return token;
        },
        async session({ session, token, user }) {
            await dbConnect();

            // If using JWT strategy, user comes from token
            // If using database strategy, user comes from the adapter
            const userId = user?.id || token.sub;

            try {
                // Find the user in our database
                const dbUser = await User.findOne({
                    $or: [
                        { _id: userId },
                        { discordId: token.id || user?.id }
                    ]
                });

                // Add custom user properties to the session
                if (dbUser) {
                    session.user.id = dbUser._id.toString();
                    session.user.role = dbUser.role || 'user';
                    session.user.discordId = dbUser.discordId;
                    session.user.username = dbUser.username;
                }
            } catch (error) {
                console.error("Error in session callback:", error);
            }

            return session;
        },
    },
    events: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'discord' && profile) {
                await dbConnect();

                const discordProfile = profile as any;
                const discordId = discordProfile.id;

                try {
                    // Check if user exists by Discord ID
                    let existingUser = await User.findOne({ discordId });

                    if (!existingUser) {
                        // Create new user if they don't exist
                        await User.create({
                            discordId,
                            username: discordProfile.username || discordProfile.global_name,
                            discriminator: discordProfile.discriminator || '',
                            email: discordProfile.email,
                            name: discordProfile.global_name || discordProfile.username,
                            image: discordProfile.image_url ||
                            discordProfile.avatar ?
                                `https://cdn.discordapp.com/avatars/${discordId}/${discordProfile.avatar}.png` :
                                null,
                            role: 'user',
                        });
                    }
                } catch (error) {
                    console.error("Error in signIn event:", error);
                }
            }
        },
    },
    pages: {
        signIn: '/auth',
    },
    session: {
        strategy: 'jwt', // Use JWT for simpler setup
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
