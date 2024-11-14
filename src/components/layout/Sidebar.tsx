// src/components/layout/Sidebar.tsx
'use client';

import Link from "next/link";
import { Home, Settings, Users, BarChart2, MessageSquare, Folder, X } from "lucide-react";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const sidebarItems = [
    { name: "대시보드", icon: Home, href: "/dashboard" },
    { name: "서버 관리", icon: Folder, href: "/servers" },
    { name: "유저 관리", icon: Users, href: "/users" },
    { name: "통계", icon: BarChart2, href: "/stats" },
    { name: "명령어 관리", icon: MessageSquare, href: "/commands" },
    { name: "설정", icon: Settings, href: "/settings" },
];

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
    return (
        <>
            {/* 오버레이 */}
            <div
                className={`
                    fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden
                    transition-opacity duration-300 ease-in-out
                    ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* 사이드바 */}
            <div className={`
                fixed top-0 left-0 h-full bg-[#1e293b] border-r border-gray-800
                w-64 lg:w-64 z-50
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-gray-800 justify-between">
                    <span className="text-xl font-bold text-white">Discord Bot</span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <nav className="mt-5 px-3">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className="flex items-center px-3 py-2 mt-2 text-gray-300 rounded-lg
                                         hover:bg-[#2d3748] hover:text-white
                                         transition-all duration-200 ease-in-out"
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                <span className="whitespace-nowrap">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}