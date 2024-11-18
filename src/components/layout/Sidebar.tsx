'use client';

import Link from "next/link";
import {
    Home,
    Settings,
    Users,
    BarChart2,
    MessageSquare,
    Server,
    Database,
    Clock,
    Play,
    Filter,
    MessageCircle,
    Activity,
    AlertCircle,
    Bell,
    Globe,
    Hash,
    ChevronDown
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Define the interface for sub-items
interface SidebarSubItem {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
}

// Define the interface for main sidebar items
interface SidebarItem {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    href: string;
    subItems?: SidebarSubItem[];
}

// Define the props for the Sidebar component
interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

// Define the sidebar items with explicit types
const sidebarItems: SidebarItem[] = [
    { name: "대시보드", icon: Home, href: "/dashboard" },
    {
        name: "크롤링 관리",
        icon: Globe,
        href: "/crawling",
        subItems: [
            { name: "사이트 목록", icon: Database, href: "/crawling/sites" },
            { name: "크롤링 주기", icon: Clock, href: "/crawling/schedule" },
            { name: "실행/중지", icon: Play, href: "/crawling/control" },
        ]
    },
    {
        name: "디스코드 설정",
        icon: MessageSquare,
        href: "/discord",
        subItems: [
            { name: "채널 알림", icon: Hash, href: "/discord/channels" },
            { name: "키워드 필터", icon: Filter, href: "/discord/filters" },
            { name: "메시지 템플릿", icon: MessageCircle, href: "/discord/templates" },
        ]
    },
    {
        name: "모니터링/로그",
        icon: Activity,
        href: "/monitoring",
        subItems: [
            { name: "크롤링 현황", icon: BarChart2, href: "/monitoring/status" },
            { name: "에러 로그", icon: AlertCircle, href: "/monitoring/errors" },
            { name: "알림 이력", icon: Bell, href: "/monitoring/notifications" },
        ]
    },
    { name: "서버 관리", icon: Server, href: "/servers" },
    { name: "유저 관리", icon: Users, href: "/users" },
    { name: "설정", icon: Settings, href: "/settings" },
];

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // Update the function to use the SidebarItem type
    const toggleExpand = (href: string) => {
        setExpandedItems(prev =>
          prev.includes(href)
            ? prev.filter(item => item !== href)
            : [...prev, href]
        );
    };

    // Update the function to use the SidebarItem type
    const isActiveItem = (item: SidebarItem): boolean => {
        if (pathname === item.href) return true;
        if (item.subItems) {
            return item.subItems.some((subItem: SidebarSubItem) => pathname === subItem.href);
        }
        return false;
    };

    return (
      <>
          {/* Overlay for mobile view */}
          <div
            className={`
                    fixed inset-0 bg-black/50 z-40 lg:hidden
                    transition-opacity duration-300
                    ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className={`
                fixed top-0 left-0 h-full w-64 
                bg-secondary border-r border-muted
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 z-50 overflow-y-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              {/* Sidebar Header */}
              <div className="h-16 border-b border-muted flex items-center px-6">
                  <span className="text-xl font-bold text-foreground">Discord Bot</span>
              </div>

              {/* Navigation Items */}
              <nav className="p-4 space-y-1">
                  {sidebarItems.map((item) => (
                    <div key={item.href} className="space-y-1">
                        {item.subItems ? (
                          // Item with sub-menu
                          <div
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
                              isActiveItem(item)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                            )}
                            onClick={() => toggleExpand(item.href)}
                          >
                              <div className="flex items-center gap-3">
                                  <item.icon className="h-5 w-5" />
                                  <span>{item.name}</span>
                              </div>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  expandedItems.includes(item.href) && "transform rotate-180"
                                )}
                              />
                          </div>
                        ) : (
                          // Item without sub-menu
                          <Link
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                              isActiveItem(item)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                            )}
                          >
                              <item.icon className="h-5 w-5" />
                              <span>{item.name}</span>
                          </Link>
                        )}

                        {/* Render sub-items if expanded */}
                        {item.subItems && expandedItems.includes(item.href) && (
                          <div className="ml-4 space-y-1">
                              {item.subItems.map((subItem: SidebarSubItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => setIsSidebarOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                    pathname === subItem.href
                                      ? "bg-primary/10 text-primary"
                                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                                  )}
                                >
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.name}</span>
                                </Link>
                              ))}
                          </div>
                        )}
                    </div>
                  ))}
              </nav>
          </div>
      </>
    );
}
