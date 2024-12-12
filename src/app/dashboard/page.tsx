'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Users, MessageSquare } from "lucide-react";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">관리자 대시보드</h2>
				<p className="text-muted-foreground">
					디스코드 봇의 전반적인 상태를 확인하세요.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card className="bg-secondary/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							총 서버 수
						</CardTitle>
						<Server className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0</div>
						<p className="text-xs text-muted-foreground">
							접속 중인 서버
						</p>
					</CardContent>
				</Card>

				<Card className="bg-secondary/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							총 사용자
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0</div>
						<p className="text-xs text-muted-foreground">
							활성 사용자
						</p>
					</CardContent>
				</Card>

				<Card className="bg-secondary/50">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							명령어 사용
						</CardTitle>
						<MessageSquare className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">0</div>
						<p className="text-xs text-muted-foreground">
							지난 30일
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}