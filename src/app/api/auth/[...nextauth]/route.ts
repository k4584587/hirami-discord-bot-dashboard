import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// 환경변수에서 Discord API URL 가져오기
const DISCORD_API_URL = process.env.DISCORD_API_URL;

// 사용자 프로필 타입 정의
interface UserProfile {
	id: string;
	username: string;
	global_name: string;
	discriminator: string;
	avatar: string;
}

// NextAuth 옵션 정의
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
			if (account && profile) {
				const extendedProfile = profile as UserProfile;
				token.id = extendedProfile.id;
				token.username = extendedProfile.username;
				token.global_name = extendedProfile.global_name;
				token.discriminator = extendedProfile.discriminator;
				token.avatar = extendedProfile.avatar;
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.username = token.username as string;
				session.user.global_name = token.global_name as string;
				session.user.discriminator = token.discriminator as string;
				session.user.avatar = token.avatar as string;
			}
			return session;
		},

		async signIn({ profile }) {
			try {
				if (profile) {
					const extendedProfile = profile as UserProfile;

					// 관리자 생성 API 호출
					const createResponse = await fetch(`${DISCORD_API_URL}/api/admin/create`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(profile)
					});

					if (!createResponse.ok) {
						console.error('관리자 등록 API 호출 실패:', createResponse.status);
						return false;
					}

					const createData = await createResponse.json();

					// result_code가 101인 경우 관리자 확인 API 호출
					if (createData.result_code === '101') {
						const checkResponse = await fetch(`${DISCORD_API_URL}/api/admin/check?discordId=${extendedProfile.id}`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
						});

						if (!checkResponse.ok) {
							console.error('관리자 확인 API 호출 실패:', checkResponse.status);
							return false;
						}

						const checkData = await checkResponse.json();

						// isAdmin이 true인 경우에만 로그인 허용
						if (checkData.isAdmin) {
							console.log('로그인 허용');
							return true;
						} else {
							console.log('로그인 거부');
							return false;
						}
					}
				}
			} catch (error) {
				console.error('API 호출 중 오류 발생:', error);
				return false;
			}
			return true;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };