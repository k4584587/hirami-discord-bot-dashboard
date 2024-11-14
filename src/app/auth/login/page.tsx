'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const from = searchParams.get('from') ?? '/dashboard';

    return (
        <div className="h-screen grid place-items-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl">관리자 로그인</CardTitle>
                    <CardDescription>
                        디스코드 계정으로 로그인하여 봇을 관리하세요
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button
                            className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white"
                            onClick={() => {
                                const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
                                const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`);
                                const scope = 'identify guilds';

                                window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${from}`;
                            }}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -28.5 256 256"
                            >
                                <path
                                    d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z"
                                    fill="currentColor"
                                    fillRule="nonzero"
                                />
                            </svg>
                            디스코드로 로그인
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