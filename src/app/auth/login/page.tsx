"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

	useEffect(() => {
		if (status === "authenticated") {
			router.push(callbackUrl);
		}
	}, [session, status, router, callbackUrl]);

	const handleLogin = async () => {
		try {
			await signIn("discord", {
				callbackUrl: callbackUrl,
				redirect: true
			});
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
	  <div className="flex items-center justify-center h-full bg-background p-4">
		  <Card className="w-full max-w-md">
			  <CardHeader className="space-y-1 text-center">
				  <CardTitle className="text-2xl">관리자 로그인</CardTitle>
				  <CardDescription>디스코드 계정으로 로그인하여 봇을 관리하세요</CardDescription>
			  </CardHeader>
			  <CardContent>
				  <div className="space-y-4">
					  <Button
						className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white h-10 sm:h-12 md:h-14 text-base sm:text-lg md:text-xl flex items-center justify-center gap-3 sm:gap-4"
						onClick={handleLogin}
					  >
						  <svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 127 96"
							className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8"
							fill="currentColor"
						  >
							  <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.14c2.64-27.38-4.51-51.11-18.9-72.15zM42.45 65.69C36.18 65.69 31 60 31 53s5-12.74 11.43-12.74S54 46 53.89 53s-5.05 12.69-11.44 12.69zm42.24 0C78.41 65.69 73.25 60 73.25 53s5-12.74 11.44-12.74S96.23 46 96.12 53s-5.04 12.69-11.43 12.69z"/>
						  </svg>
						  Discord로 로그인
					  </Button>
					  <p className="text-sm text-center text-muted-foreground">
						  봇 관리자만 로그인할 수 있습니다
					  </p>
				  </div>
			  </CardContent>
		  </Card>
	  </div>
	);
}