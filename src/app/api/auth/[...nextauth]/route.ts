import NextAuth, { NextAuthOptions, User, Profile } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

interface ExtendedUser extends User {
    id?: string;
    username?: string;
    discriminator?: string;
    avatar?: string;
}

interface ExtendedProfile extends Profile {
    id?: string;
    username?: string;
    discriminator?: string;
    avatar?: string;
}

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
        async jwt({ token, account, profile }) {
            const extendedProfile = profile as ExtendedProfile;

            if (account && profile) {
                token.id = extendedProfile.id;
                token.username = extendedProfile.username;
                token.discriminator = extendedProfile.discriminator;
                token.avatar = extendedProfile.avatar;
            }
            return token;
        },
        async session({ session, token }) {
            const extendedUser = session.user as ExtendedUser;

            if (token) {
                extendedUser.id = token.id;
                extendedUser.username = token.username as string;
                extendedUser.discriminator = token.discriminator as string;
                extendedUser.avatar = token.avatar as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };