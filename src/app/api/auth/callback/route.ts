// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const DISCORD_API = 'https://discord.com/api/v10';
const ADMIN_USER_IDS = ['your_discord_user_id']; // 관리자 Discord ID 배열

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Discord Token 교환
        const tokenResponse = await fetch(`${DISCORD_API}/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
                client_secret: process.env.DISCORD_CLIENT_SECRET!,
                grant_type: 'authorization_code',
                code,
                redirect_uri: `${new URL(request.url).origin}/api/auth/callback`,
            }),
        });

        const tokenData = await tokenResponse.json();

        // 사용자 정보 가져오기
        const userResponse = await fetch(`${DISCORD_API}/users/@me`, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userResponse.json();

        // 관리자 권한 확인
        if (!ADMIN_USER_IDS.includes(userData.id)) {
            return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
        }

        // JWT 토큰 생성
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ userId: userData.id })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        // 쿠키에 토큰 저장 및 리다이렉트
        const response = NextResponse.redirect(new URL(state || '/dashboard', request.url));
        cookies().set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;

    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}