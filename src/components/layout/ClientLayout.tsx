'use client';

import { useState } from "react";
import { Menu, Github } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* 메인 컨텐츠 영역 */}
            <div className={`
                lg:ml-64 
                transition-all duration-300 ease-in-out
                flex flex-col min-h-screen
            `}>
                {/* 상단 네비게이션 바 */}
                <nav className="h-16 border-b border-gray-800 bg-[#1e293b] sticky top-0 z-30">
                    <div className="h-full px-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden mr-4 text-gray-400 hover:text-white
                                         transition-colors duration-200"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <span className="text-xl font-bold text-white">관리자 대시보드</span>
                        </div>

                        {/* Discord 로그인 버튼 */}
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752c4] text-white transition-colors duration-200"
                            onClick={() => {
                                console.log('Discord login clicked');
                            }}
                        >
                            <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -28.5 256 256"
                            >
                                <path
                                    d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                                    fill="currentColor"
                                    fillRule="nonzero"
                                />
                            </svg>
                            <span>Discord 로그인</span>
                        </Button>
                    </div>
                </nav>

                {/* 메인 컨텐츠 */}
                <main className="p-4 lg:p-6 flex-1">
                    {children}
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-800 bg-[#1e293b] text-gray-400 mt-auto">
                    <div className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-sm">
                                © 2024 Discord Bot Admin. All rights reserved.
                            </div>
                            <div className="flex items-center gap-4">
                                <a href="https://github.com" className="hover:text-white transition-colors inline-flex items-center gap-2">
                                    <Github className="h-4 w-4" />
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