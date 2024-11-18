'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Edit2, Trash2, PlayCircle, StopCircle } from 'lucide-react';

// 임시 데이터
const siteData = [
    {
        id: 1,
        name: "네이버 카페",
        url: "https://cafe.naver.com/example",
        xpath: "//*[@id='main-area']/div[2]/table/tbody/tr",
        assistantName: "네이버봇",
        interval: 5,
        isActive: true,
        lastCrawled: "2024-03-17 15:30:00"
    },
    // ... 더미 데이터 추가 가능
];

export default function CrawlingSitesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">크롤링 사이트 관리</h1>
                    <p className="text-muted-foreground mt-2">
                        크롤링 대상 사이트를 관리하고 모니터링할 수 있습니다.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>사이트 목록</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    사이트 추가
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>새 크롤링 사이트 추가</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label>사이트명</label>
                                        <Input placeholder="예: 네이버 카페" />
                                    </div>
                                    <div className="space-y-2">
                                        <label>URL</label>
                                        <Input placeholder="https://" />
                                    </div>
                                    <div className="space-y-2">
                                        <label>XPath</label>
                                        <Input placeholder="게시물 목록 XPath" />
                                    </div>
                                    <div className="space-y-2">
                                        <label>Assistant 이름</label>
                                        <Input placeholder="크롤링 담당 Assistant 이름" />
                                    </div>
                                    <div className="space-y-2">
                                        <label>크롤링 주기 (분)</label>
                                        <Input type="number" min="1" placeholder="5" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="active" />
                                        <label htmlFor="active">활성화</label>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => {}}>취소</Button>
                                    <Button onClick={() => {}}>저장</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                placeholder="사이트명 또는 URL로 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-md"
                            />
                            <Button variant="outline" size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>상태</TableHead>
                                    <TableHead>사이트명</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Assistant</TableHead>
                                    <TableHead>크롤링 주기</TableHead>
                                    <TableHead>마지막 크롤링</TableHead>
                                    <TableHead className="text-right">작업</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {siteData.map((site) => (
                                    <TableRow key={site.id}>
                                        <TableCell>
                                            <Badge
                                                variant={site.isActive ? "success" : "secondary"}
                                                className="w-20 justify-center"
                                            >
                                                {site.isActive ? '활성' : '비활성'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{site.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {site.url}
                                        </TableCell>
                                        <TableCell>{site.assistantName}</TableCell>
                                        <TableCell>{site.interval}분</TableCell>
                                        <TableCell>{site.lastCrawled}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="icon">
                                                    {site.isActive ?
                                                        <StopCircle className="h-4 w-4" /> :
                                                        <PlayCircle className="h-4 w-4" />
                                                    }
                                                </Button>
                                                <Button variant="outline" size="icon">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}