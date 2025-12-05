"use client";

import { SignedOut, SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Car, Search, Menu, X, BookOpen, Calendar } from "lucide-react";

const Navbar = () => {
  const { isLoaded, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        {/* 로고 */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600 flex-shrink-0">
          트립카셰어
        </Link>
        
        {/* 데스크톱 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center gap-6">
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
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>예약 관리</span>
              </Link>
            </>
          )}

          <Link 
            href="/guide/renter" 
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>이용 가이드</span>
          </Link>
        </nav>

        {/* 데스크톱 인증 버튼 */}
        <div className="hidden md:flex gap-4 items-center">
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
          {!isLoaded && <div className="w-20 h-10" />}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="flex md:hidden items-center gap-3">
          {isLoaded && (
            <SignedIn>
              <UserButton />
            </SignedIn>
          )}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col p-4 gap-1">
            <Link 
              href="/vehicles" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>차량 검색</span>
            </Link>
            
            {isLoaded && user && (
              <>
                <Link 
                  href="/vehicles/my" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Car className="w-5 h-5" />
                  <span>내 차량 관리</span>
                </Link>
                
                <Link 
                  href="/bookings/my" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>예약 관리</span>
                </Link>

                <Link 
                  href="/bookings/received" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  <span>받은 예약</span>
                </Link>
              </>
            )}

            <Link 
              href="/guide/renter" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>이용자 가이드</span>
            </Link>

            <Link 
              href="/guide/owner" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>차주 가이드</span>
            </Link>

            {/* 모바일 로그인 버튼 */}
            {isLoaded && (
              <SignedOut>
                <div className="pt-3 border-t mt-2">
                  <SignInButton mode="modal">
                    <Button className="w-full">로그인</Button>
                  </SignInButton>
                </div>
              </SignedOut>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
