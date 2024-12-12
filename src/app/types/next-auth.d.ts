// types/next-auth.d.ts

import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			id?: string;
			username?: string;
			global_name?: string;
			discriminator?: string;
			avatar?: string;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		username?: string;
		global_name?: string;
		discriminator?: string;
		avatar?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends NextAuthJWT {
		id?: string;
		username?: string;
		global_name?: string;
		discriminator?: string;
		avatar?: string;
	}
}
