'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Server, MessageSquare } from "lucide-react";

export default function DashboardPage() {
    const stats = [
        {
            title: "총 서버 수",
            value: "12",
            icon: Server,
            description: "접속 중인 서버"
        },
        {
            title: "총 사용자",
            value: "1,234",
            icon: Users,
            description: "활성 사용자"
        },
        {
            title: "명령어 사용",
            value: "8,234",
            icon: MessageSquare,
            description: "지난 30일"
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">대시보드</h2>
                <p className="text-gray-400">
                    디스코드 봇의 전반적인 상태를 확인하세요
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Card key={index} className="bg-[#1e293b] border-gray-800">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-200">
                                    {item.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{item.value}</div>
                                <p className="text-xs text-gray-400">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}