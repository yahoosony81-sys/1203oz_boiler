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

// metadataBase는 OG 이미지의 절대 URL 생성에 필수
export const metadata: Metadata = {
  metadataBase: new URL("https://tripcarshare.vercel.app"),
  title: "TripCarShare - 제주 공항 차량 공유",
  description: "제주 공항에서 시작하는 스마트한 P2P 차량 공유 서비스. 현지 차주와 직접 연결되는 편리하고 합리적인 차량 공유 플랫폼",
  keywords: ["제주", "렌트카", "차량 공유", "P2P", "공항", "여행", "TripCarShare"],
  authors: [{ name: "TripCarShare" }],
  openGraph: {
    title: "TripCarShare - 제주 공항 차량 공유",
    description: "제주 공항에서 시작하는 스마트한 P2P 차량 공유 서비스. 현지 차주와 직접 연결되는 편리하고 합리적인 차량 공유 플랫폼",
    url: "https://tripcarshare.vercel.app",
    siteName: "TripCarShare",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripCarShare - 제주 공항 차량 공유",
    description: "제주 공항에서 시작하는 스마트한 P2P 차량 공유 서비스",
  },
  robots: {
    index: true,
    follow: true,
  },
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
