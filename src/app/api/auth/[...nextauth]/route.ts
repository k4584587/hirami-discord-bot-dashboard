// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Define the NextAuth options
export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            authorization: { params: { scope: "identify email guilds" } },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        /**
         * @param {object} params
         * @param {JWT} params.token
         * @param {object} params.user
         * @param {object} params.account
         * @param {object} params.profile
         */
        async jwt({ token, account, profile }) {
            if (account && profile) {
                // Type assertion is safe here because we've extended the JWT interface
                const extendedProfile = profile as {
                    id: string;
                    username: string;
                    discriminator: string;
                    avatar: string;
                };
                token.id = extendedProfile.id;
                token.username = extendedProfile.username;
                token.discriminator = extendedProfile.discriminator;
                token.avatar = extendedProfile.avatar;
            }
            return token;
        },
        /**
         * @param {object} params
         * @param {Session} params.session
         * @param {JWT} params.token
         */
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.discriminator = token.discriminator;
                session.user.avatar = token.avatar;
            }
            return session;
        },
    },
};

// Initialize NextAuth with the defined options
const handler = NextAuth(authOptions);

// Export only GET and POST handlers
export { handler as GET, handler as POST };
