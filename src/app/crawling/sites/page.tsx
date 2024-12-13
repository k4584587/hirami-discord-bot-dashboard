'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
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
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	Search,
	Plus,
	Edit2,
	Trash2,
	PlayCircle,
	StopCircle,
} from "lucide-react";

interface CrawlingSite {
	id: number;
	name: string;
	url: string;
	xpath: string;
	assistantName: string;
	interval: number;
	isActive: boolean;
	lastCrawled: string | null;
}

export default function CrawlingSitesPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [siteData, setSiteData] = useState<CrawlingSite[]>([]);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	// 새 사이트 추가를 위한 상태
	const [newSite, setNewSite] = useState({
		name: "",
		url: "",
		xpath: "",
		assistantName: "",
		interval: 5,
		isActive: true,
	});

	// 편집 중인 사이트의 입력 필드 상태
	const [editSite, setEditSite] = useState<CrawlingSite | null>(null);

	useEffect(() => {
		const fetchCrawlingSites = async () => {
			try {
				const response = await fetch('/api/crawling-sites'); // API Route 호출
				if (!response.ok) {
					throw new Error("CrawlingSite 데이터를 가져오는 데 실패했습니다.");
				}
				const data = await response.json();
				setSiteData(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchCrawlingSites();
	}, []);

	const handleEditClick = (site: CrawlingSite) => {
		setEditSite(site); // 편집 상태 초기화
		setIsEditDialogOpen(true);
	};

	const handleCloseEditDialog = () => {
		setEditSite(null);
		setIsEditDialogOpen(false);
	};

	// 새 사이트 입력 필드 변경 핸들러
	const handleNewSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setNewSite((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	// 편집 사이트 입력 필드 변경 핸들러
	const handleEditSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!editSite) return;
		const { name, value, type, checked } = e.target;
		setEditSite((prev) => prev ? ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}) : null);
	};

	// 새 사이트 추가 핸들러
	const handleAddSite = async () => {
		try {
			const response = await fetch('/api/crawling-sites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newSite),
			});

			if (!response.ok) {
				throw new Error('사이트 추가에 실패했습니다.');
			}

			const addedSite = await response.json();
			setSiteData((prev) => [...prev, addedSite]);
			// 폼 초기화
			setNewSite({
				name: "",
				url: "",
				xpath: "",
				assistantName: "",
				interval: 5,
				isActive: true,
			});
			setIsAddDialogOpen(false);
		} catch (error) {
			console.error(error);
			// 에러 처리: 사용자에게 알림을 표시하거나 추가 로직을 구현할 수 있습니다.
		}
	};

	// 사이트 수정 핸들러
	const handleUpdateSite = async () => {
		if (!editSite) return;
		try {
			const response = await fetch(`/api/crawling-sites/${editSite.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editSite),
			});

			if (!response.ok) {
				throw new Error('사이트 수정에 실패했습니다.');
			}

			const updatedSite = await response.json();
			setSiteData((prev) =>
				prev.map((site) => (site.id === updatedSite.id ? updatedSite : site))
			);
			handleCloseEditDialog();
		} catch (error) {
			console.error(error);
			// 에러 처리: 사용자에게 알림을 표시하거나 추가 로직을 구현할 수 있습니다.
		}
	};

	// 사이트 삭제 핸들러
	const handleDeleteSite = async (id: number) => {
		if (!confirm("정말로 이 사이트를 삭제하시겠습니까?")) return;

		try {
			const response = await fetch(`/api/crawling-sites/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('사이트 삭제에 실패했습니다.');
			}

			setSiteData((prev) => prev.filter((site) => site.id !== id));
		} catch (error) {
			console.error(error);
			// 에러 처리: 사용자에게 알림을 표시하거나 추가 로직을 구현할 수 있습니다.
		}
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						크롤링 사이트 관리
					</h1>
					<p className="text-muted-foreground mt-2">
						크롤링 대상 사이트를 관리하고 모니터링할 수 있습니다.
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle>사이트 목록</CardTitle>
						<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
										<label htmlFor="name">사이트명</label>
										<Input
											id="name"
											name="name"
											placeholder="예: 네이버 카페"
											value={newSite.name}
											onChange={handleNewSiteChange}
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="url">URL</label>
										<Input
											id="url"
											name="url"
											placeholder="https://"
											value={newSite.url}
											onChange={handleNewSiteChange}
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="xpath">XPath</label>
										<Input
											id="xpath"
											name="xpath"
											placeholder="게시물 목록 XPath"
											value={newSite.xpath}
											onChange={handleNewSiteChange}
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="assistantName">Assistant 이름</label>
										<Input
											id="assistantName"
											name="assistantName"
											placeholder="크롤링 담당 Assistant 이름"
											value={newSite.assistantName}
											onChange={handleNewSiteChange}
										/>
									</div>
									<div className="space-y-2">
										<label htmlFor="interval">크롤링 주기 (분)</label>
										<Input
											id="interval"
											name="interval"
											type="number"
											min="1"
											placeholder="5"
											value={newSite.interval}
											onChange={handleNewSiteChange}
										/>
									</div>
									<div className="flex items-center space-x-2">
										<Switch
											id="isActive"
											name="isActive"
											checked={newSite.isActive}
											onCheckedChange={(checked) =>
												setNewSite((prev) => ({ ...prev, isActive: checked }))
											}
										/>
										<label htmlFor="isActive">활성화</label>
									</div>
								</div>
								<div className="flex justify-end space-x-2">
									<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
										취소
									</Button>
									<Button onClick={handleAddSite}>저장</Button>
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
								{siteData
									.filter(
										(site) =>
											site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
											site.url.toLowerCase().includes(searchTerm.toLowerCase())
									)
									.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center text-muted-foreground">
											데이터가 없습니다.
										</TableCell>
									</TableRow>
								) : (
									siteData
										.filter(
											(site) =>
												site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
												site.url.toLowerCase().includes(searchTerm.toLowerCase())
										)
										.map((site) => (
											<TableRow key={site.id}>
												<TableCell>
													<Badge
														variant={site.isActive ? "success" : "secondary"}
														className="w-20 justify-center"
													>
														{site.isActive ? "활성" : "비활성"}
													</Badge>
												</TableCell>
												<TableCell className="font-medium">{site.name}</TableCell>
												<TableCell className="text-muted-foreground">
													<div className="max-w-[200px] truncate" title={site.url}>
														{site.url}
													</div>
												</TableCell>
												<TableCell>{site.assistantName}</TableCell>
												<TableCell>{site.interval}분</TableCell>
												<TableCell>
													{site.lastCrawled || "-"}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end space-x-2">
														<Button variant="outline" size="icon">
															{site.isActive ? (
																<StopCircle className="h-4 w-4" />
															) : (
																<PlayCircle className="h-4 w-4" />
															)}
														</Button>
														<Button variant="outline" size="icon" onClick={() => handleEditClick(site)}>
															<Edit2 className="h-4 w-4" />
														</Button>
														<Button
															variant="outline"
															size="icon"
															className="text-destructive"
															onClick={() => handleDeleteSite(site.id)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* 편집 다이얼로그 */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>크롤링 사이트 수정</DialogTitle>
					</DialogHeader>
					{editSite && (
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<label htmlFor="edit-name">사이트명</label>
								<Input
									id="edit-name"
									name="name"
									placeholder="예: 네이버 카페"
									value={editSite.name}
									onChange={handleEditSiteChange}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="edit-url">URL</label>
								<Input
									id="edit-url"
									name="url"
									placeholder="https://"
									value={editSite.url}
									onChange={handleEditSiteChange}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="edit-xpath">XPath</label>
								<Input
									id="edit-xpath"
									name="xpath"
									placeholder="게시물 목록 XPath"
									value={editSite.xpath}
									onChange={handleEditSiteChange}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="edit-assistantName">Assistant 이름</label>
								<Input
									id="edit-assistantName"
									name="assistantName"
									placeholder="크롤링 담당 Assistant 이름"
									value={editSite.assistantName}
									onChange={handleEditSiteChange}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="edit-interval">크롤링 주기 (분)</label>
								<Input
									id="edit-interval"
									name="interval"
									type="number"
									min="1"
									placeholder="5"
									value={editSite.interval}
									onChange={handleEditSiteChange}
								/>
							</div>
							<div className="flex items-center space-x-2">
								<Switch
									id="edit-isActive"
									name="isActive"
									checked={editSite.isActive}
									onCheckedChange={(checked) =>
										setEditSite((prev) => prev ? { ...prev, isActive: checked } : null)
									}
								/>
								<label htmlFor="edit-isActive">활성화</label>
							</div>
						</div>
					)}
					<div className="flex justify-end space-x-2">
						<Button variant="outline" onClick={handleCloseEditDialog}>취소</Button>
						<Button onClick={handleUpdateSite}>저장</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
