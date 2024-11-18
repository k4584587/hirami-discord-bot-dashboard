import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AuthProvider from "@/components/providers/auth-provider"; // AuthProvider import
import { ClientLayout } from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Discord Bot Admin",
    description: "Discord Bot Administration Dashboard",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider defaultTheme="light" storageKey="theme-preference">
            <AuthProvider>
                <ClientLayout>{children}</ClientLayout>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}