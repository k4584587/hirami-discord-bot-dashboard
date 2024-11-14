// src/components/layout/Sidebar.tsx
'use client';

import Link from "next/link";
import { Home, Settings, Users, BarChart2, MessageSquare, Server } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const sidebarItems = [
    { name: "대시보드", icon: Home, href: "/dashboard" },
    { name: "서버 관리", icon: Server, href: "/servers" },
    { name: "유저 관리", icon: Users, href: "/users" },
    { name: "통계", icon: BarChart2, href: "/stats" },
    { name: "명령어 관리", icon: MessageSquare, href: "/commands" },
    { name: "설정", icon: Settings, href: "/settings" },
];

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* 오버레이 */}
            <div
                className={`
                    fixed inset-0 bg-black/50 z-40 lg:hidden
                    transition-opacity duration-300
                    ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* 사이드바 */}
            <div className={`
                fixed top-0 left-0 h-full w-64 
                bg-secondary border-r border-muted
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 z-50
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* 로고 영역 */}
                <div className="h-16 border-b border-muted flex items-center px-6">
                    <span className="text-xl font-bold text-foreground">Discord Bot</span>
                </div>

                {/* 네비게이션 */}
                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}