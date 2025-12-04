"use client";

import { SignedOut, SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Car, Search } from "lucide-react";

const Navbar = () => {
  const { isLoaded, user } = useUser();

  return (
    <header className="border-b">
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          트립카셰어
        </Link>
        
        {/* 네비게이션 메뉴 */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/vehicles" 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>차량 검색</span>
          </Link>
          
          {isLoaded && user && (
            <>
              <Link 
                href="/vehicles/my" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Car className="w-4 h-4" />
                <span>내 차량</span>
              </Link>
              
              <Link 
                href="/bookings/my" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                예약 관리
              </Link>
            </>
          )}

          <Link 
            href="/guide" 
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            이용 가이드
          </Link>
        </nav>

        <div className="flex gap-4 items-center">
          {/* 인증 상태가 로드될 때까지 기다림 */}
          {isLoaded && (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button>로그인</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          )}
          {/* 로딩 중일 때는 빈 공간 유지 (레이아웃 깨짐 방지) */}
          {!isLoaded && <div className="w-20 h-10" />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
