'use client';

import {
	useState,
	useEffect
} from 'react';
import {
	Button
} from "@/components/ui/button";
import {
	Input
} from "@/components/ui/input";
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
import {
	Badge
} from "@/components/ui/badge";
import {
	Switch
} from "@/components/ui/switch";
import {
	Search,
	Plus,
	Edit2,
	Trash2,
	PlayCircle,
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

	// 에러 메시지 상태
	const [error, setError] = useState<string | null>(null);

	// 로딩 상태 (사이트 ID를 저장하는 Set)
	const [loadingSites, setLoadingSites] = useState<Set<string>>(new Set());

	useEffect(() => {
		const fetchCrawlingSites = async () => {
			try {
				const response = await fetch('/api/crawling-sites'); // API Route 호출
				if (!response.ok) {
					throw new Error("CrawlingSite 데이터를 가져오는 데 실패했습니다.");
				}
				const data = await response.json();
				setSiteData(data);
				console.log('Fetched Crawling Sites:', data);
			} catch (error) {
				console.error(error);
				setError("사이트 데이터를 불러오는 데 실패했습니다.");
			}
		};

		const fetchCrawlingStatus = async () => {
			try {
				const response = await fetch('http://localhost:3002/api/crawling-status');
				if (!response.ok) {
					throw new Error("크롤링 상태를 가져오는 데 실패했습니다.");
				}
				const statusData = await response.json();
				const activeCrawls = Object.keys(statusData).filter(key => statusData[key].isCrawling);
				setLoadingSites(new Set(activeCrawls));
				console.log('Fetched Crawling Status:', statusData);
			} catch (error) {
				console.error(error);
				// 에러는 무시하거나 사용자에게 알림
			}
		};

		fetchCrawlingSites();
		fetchCrawlingStatus();
	}, []);

	const handleEditClick = (site: CrawlingSite) => {
		setEditSite(site); // 편집 상태 초기화
		setIsEditDialogOpen(true);
	};

	const handleCloseEditDialog = () => {
		setEditSite(null);
		setIsEditDialogOpen(false);
		setError(null); // 에러 초기화
	};

	// 새 사이트 입력 필드 변경 핸들러
	const handleNewSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {
			name,
			value,
			type,
			checked
		} = e.target;
		setNewSite((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	// 편집 사이트 입력 필드 변경 핸들러
	const handleEditSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!editSite) return;
		const {
			name,
			value,
			type,
			checked
		} = e.target;
		setEditSite((prev) =>
			prev
				? {
					...prev,
					[name]:
						type === 'checkbox'
							? checked
							: name === 'interval'
								? parseInt(value, 10) || 0
								: value,
				}
				: null
		);
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
			console.log('Added Site:', addedSite);
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
			setError(null); // 성공 시 에러 초기화
		} catch (error) {
			console.error(error);
			setError("사이트 추가에 실패했습니다.");
		}
	};

	// 사이트 수정 핸들러
	const handleUpdateSite = async (e: React.FormEvent) => {
		e.preventDefault(); // 폼의 기본 제출 동작 방지
		if (!editSite) return;
		const siteId = `${editSite.assistantName}-${editSite.url}`;
		setLoadingSites(prev => new Set(prev).add(siteId));
		console.log(`Starting update for siteId: ${siteId}`);
		try {
			const response = await fetch(`/api/crawling-sites/${editSite.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editSite),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || '사이트 수정에 실패했습니다.');
			}

			const updatedSite = await response.json();
			setSiteData((prev) =>
				prev.map((site) => (site.id === updatedSite.id ? updatedSite : site))
			);
			console.log('Updated Site:', updatedSite);
			handleCloseEditDialog();
		} catch (error) {
			console.error(error);
			setError("사이트 수정에 실패했습니다.");
		} finally {
			setLoadingSites(prev => {
				const newSet = new Set(prev);
				newSet.delete(siteId);
				console.log(`Completed update for siteId: ${siteId}`);
				return newSet;
			});
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
			console.log(`Deleted Site with id: ${id}`);
		} catch (error) {
			console.error(error);
			setError("사이트 삭제에 실패했습니다.");
		}
	};

	// 크롤링 핸들러
	const handleCrawl = (site: CrawlingSite) => {
		const siteId = `${site.assistantName}-${site.url}`;
		setLoadingSites(prev => new Set(prev).add(siteId));
		console.log(`Starting crawl for siteId: ${siteId}`);

		try {
			// 모든 필요한 파라미터를 쿼리 스트링에 포함
			const queryParams = new URLSearchParams({
				assistantName: site.assistantName,
				url: site.url,
				xpath: site.xpath,
			}).toString();

			const eventSource = new EventSource(`http://localhost:3002/api/crawl?${queryParams}`);

			// 이벤트 수신
			eventSource.onmessage = (event) => {
				console.log(`Received SSE message for siteId: ${siteId}`, event.data);
				try {
					const data = JSON.parse(event.data);

					switch (data.status) {
						case 'crawlingStarted':
							console.log(data.message); // 크롤링 시작 알림 처리
							break;
						case 'crawlingProgress':
							console.log(data.message); // 크롤링 진행 상황 업데이트 처리 (예: ProgressBar 업데이트)
							break;
						case 'crawlingCompleted':
							console.log(data.message); // 크롤링 완료 알림 처리
							setSiteData((prev) =>
								prev.map((s) =>
									s.id === site.id
										? {
											...s,
											lastCrawled: new Date().toISOString()
										}
										: s
								)
							);
							setLoadingSites(prev => {
								const newSet = new Set(prev);
								newSet.delete(siteId);
								return newSet;
							});
							eventSource.close(); // 연결 종료
							console.log(`Crawling completed for siteId: ${siteId}`);
							break;
						case 'gptResponse':
							console.log('GPT 응답:', data.data);
							break;
						case 'error':
							console.error('크롤링 오류:', data.message);
							alert(data.message);
							setLoadingSites(prev => {
								const newSet = new Set(prev);
								newSet.delete(siteId);
								return newSet;
							});
							eventSource.close();
							console.log(`Crawling error for siteId: ${siteId}`);
							break;
						default:
							console.warn('Unknown status:', data.status);
					}
				} catch (parseError) {
					console.error('Error parsing SSE message:', parseError);
				}
			};

			// SSE 연결 종료 시 로딩 상태 해제
			// 'onerror'를 통해 연결 종료를 감지
			eventSource.onerror = (error) => {
				console.error('SSE 연결 오류:', error);
				setLoadingSites(prev => {
					const newSet = new Set(prev);
					newSet.delete(siteId);
					return newSet;
				});
				eventSource.close(); // 오류 시 연결 종료
				console.log(`SSE connection closed for siteId: ${siteId}`);
			};
		} catch (error) {
			console.error(error);
			setLoadingSites(prev => {
				const newSet = new Set(prev);
				newSet.delete(siteId);
				return newSet;
			});
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
					  required
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
					  required
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
					  required
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
					  required
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
					  required
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
				{error && <div className="text-red-500 mt-2">{error}</div>}
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
					.map((site) => {
					  const siteId = `${site.assistantName}-${site.url}`;
					  const isLoading = loadingSites.has(siteId);
					  return (
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
							  <Button
								variant="outline"
								size="icon"
								onClick={() => handleCrawl(site)}
								disabled={isLoading} // 로딩 중에는 버튼 비활성화
							  >
								{isLoading ? (
								  <span>로딩 중...</span> // 로딩 중일 때 표시할 내용
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
					  );
					})
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
			<form onSubmit={handleUpdateSite} className="space-y-4 py-4">
			  <div className="space-y-2">
				<label htmlFor="edit-name">사이트명</label>
				<Input
				  id="edit-name"
				  name="name"
				  placeholder="예: 네이버 카페"
				  value={editSite.name}
				  onChange={handleEditSiteChange}
				  required
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
				  required
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
				  required
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
				  required
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
				  required
				/>
			  </div>
			  <div className="flex items-center space-x-2">
				<Switch
				  id="edit-isActive"
				  name="isActive"
				  checked={editSite.isActive}
				  onCheckedChange={(checked) =>
					setEditSite((prev) =>
					  prev ? { ...prev, isActive: checked } : null
					)
				  }
				/>
				<label htmlFor="edit-isActive">활성화</label>
			  </div>
			  {error && <div className="text-red-500">{error}</div>}
			  {loadingSites.has(`${editSite.assistantName}-${editSite.url}`) && <div>업데이트 중...</div>}
			  <div className="flex justify-end space-x-2">
				<Button variant="outline" type="button" onClick={handleCloseEditDialog}>
				  취소
				</Button>
				<Button type="submit">저장</Button>
			  </div>
			</form>
		  )}
		</DialogContent>
	  </Dialog>
	</div>
  );
}