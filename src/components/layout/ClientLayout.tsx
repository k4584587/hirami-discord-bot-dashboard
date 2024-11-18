'use client';

import React, { useState, useEffect } from "react";
import { Menu, Github, Sun, Moon, LogOut } from "lucide-react";

import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { useSession, signIn, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu-custom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 상태 관리
    const { theme, setTheme } = useTheme();
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // 프로필 이미지나 이름의 첫 글자를 가져오는 함수
    const getInitials = (name: string) => {
        return name?.charAt(0).toUpperCase() || '?';
    };

    useEffect(() => {
        // 로그인 페이지는 보호하지 않음
        if (pathname !== "/auth/login" && status === "unauthenticated") {
            router.replace("/auth/login");
        }
    }, [status, router, pathname]);

    if (status === "loading") {
        // 세션 로딩 중일 때 로딩 화면 표시
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className={`lg:ml-64 transition-all duration-300 ease-in-out flex flex-col flex-1`}>
                <nav className="h-16 border-b border-muted bg-secondary sticky top-0 z-30">
                    <div className="h-full px-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden mr-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <span className="text-xl font-bold text-foreground">관리자 대시보드</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>

                            {status === "authenticated" && session.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button
                                            variant="ghost"
                                            className="relative h-8 w-8 rounded-full"
                                            onClick={() => setIsDropdownOpen((prev) => !prev)} // 드롭다운 토글
                                        >
                                            <Avatar className="h-8 w-8">
                                                {session.user.image ? (
                                                    <AvatarImage src={session.user.image} alt={session.user.name || ''} />
                                                ) : (
                                                    <AvatarFallback>{getInitials(session.user.name || '')}</AvatarFallback>
                                                )}
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        isOpen={isDropdownOpen} // 드롭다운 열림 상태 전달
                                        onClose={() => setIsDropdownOpen(false)} // 드롭다운 닫기 핸들러
                                    >
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                {session.user.name && (
                                                    <p className="font-medium">{session.user.name}</p>
                                                )}
                                                {session.user.email && (
                                                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                        {session.user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <DropdownMenuItem
                                            className="text-red-600 cursor-pointer"
                                            onClick={() => signOut()}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>로그아웃</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752c4] text-white transition-colors duration-200"
                                    onClick={() => signIn("discord")}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 127.14 96.36"
                                        fill="currentColor"
                                    >
                                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                    </svg>
                                    <span>Discord 로그인</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="p-4 lg:p-6 flex-1 text-foreground">
                    {children}
                </main>

                <footer className="border-t border-muted bg-secondary text-muted-foreground mt-auto">
                    <div className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm">
                                © 2024 Discord Bot Admin. All rights reserved.
                            </div>
                            <div className="flex items-center gap-4">
                                <a href="https://github.com"
                                   className="hover:text-foreground transition-colors inline-flex items-center gap-2">
                                    <Github className="h-4 w-4"/>
                                    <span className="text-sm">GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
