// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 보호할 경로 패턴 정의
const protectedRoutes = ['/dashboard', '/servers', '/users', '/stats', '/commands', '/settings']

export function middleware(request: NextRequest) {
    // 현재 경로
    const path = request.nextUrl.pathname

    // 토큰 확인 (예: Discord 인증 후 저장된 토큰)
    const token = request.cookies.get('auth-token')?.value

    // 보호된 경로에 접근하려 할 때
    if (protectedRoutes.some(route => path.startsWith(route))) {
        // 인증되지 않은 경우
        if (!token) {
            // 로그인 페이지로 리다이렉트
            const url = new URL('/auth/login', request.url)
            url.searchParams.set('from', path)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

// 미들웨어가 실행될 경로 패턴 설정
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/servers/:path*',
        '/users/:path*',
        '/stats/:path*',
        '/commands/:path*',
        '/settings/:path*'
    ]
}