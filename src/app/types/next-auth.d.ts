import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            username?: string;
            discriminator?: string;
            avatar?: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id?: string;
        username?: string;
        discriminator?: string;
        avatar?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends NextAuthJWT {
        id?: string;
        username?: string;
        discriminator?: string;
        avatar?: string;
    }
}