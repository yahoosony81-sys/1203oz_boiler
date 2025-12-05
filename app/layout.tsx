import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

// Clerk Provider 사용으로 인한 동적 렌더링 강제
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripCarShare - 제주 공항 차량 공유",
  description: "제주 공항에서 시작하는 스마트한 P2P 차량 공유 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
        <Providers>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
        </Providers>
        </body>
      </html>
  );
}
