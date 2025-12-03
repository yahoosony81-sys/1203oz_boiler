"use client";

import { SignedOut, SignInButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { isLoaded } = useUser();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        SaaS Template
      </Link>
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
    </header>
  );
};

export default Navbar;
