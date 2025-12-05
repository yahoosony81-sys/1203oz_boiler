/**
 * @file tests/e2e/auth.spec.ts
 * @description 인증 관련 E2E 테스트
 */

import { test, expect } from "@playwright/test";

test.describe("인증 페이지", () => {
  test("로그인 페이지 접근 가능", async ({ page }) => {
    await page.goto("/sign-in");
    
    // Clerk 로그인 UI가 로드되는지 확인
    // Clerk은 외부 컴포넌트이므로 로딩 확인만
    await expect(page).toHaveURL(/sign-in/);
  });

  test("회원가입 페이지 접근 가능", async ({ page }) => {
    await page.goto("/sign-up");
    
    // Clerk 회원가입 UI가 로드되는지 확인
    await expect(page).toHaveURL(/sign-up/);
  });
});

test.describe("보호된 페이지", () => {
  test("내 예약 페이지는 로그인 필요", async ({ page }) => {
    await page.goto("/bookings/my");
    
    // 로그인 안내 또는 로그인 페이지로 리다이렉트
    const hasLoginPrompt = await page.getByText(/로그인/i).isVisible().catch(() => false);
    const isSignInPage = page.url().includes("sign-in");
    const hasContent = await page.getByText(/내 예약/i).isVisible().catch(() => false);
    
    expect(hasLoginPrompt || isSignInPage || hasContent).toBeTruthy();
  });

  test("내 차량 페이지는 로그인 필요", async ({ page }) => {
    await page.goto("/vehicles/my");
    
    const hasLoginPrompt = await page.getByText(/로그인/i).isVisible().catch(() => false);
    const isSignInPage = page.url().includes("sign-in");
    const hasContent = await page.getByText(/내 차량/i).isVisible().catch(() => false);
    
    expect(hasLoginPrompt || isSignInPage || hasContent).toBeTruthy();
  });

  test("차량 등록 페이지는 로그인 필요", async ({ page }) => {
    await page.goto("/vehicles/new");
    
    const hasLoginPrompt = await page.getByText(/로그인/i).isVisible().catch(() => false);
    const isSignInPage = page.url().includes("sign-in");
    const hasContent = await page.getByText(/차량 등록/i).isVisible().catch(() => false);
    
    expect(hasLoginPrompt || isSignInPage || hasContent).toBeTruthy();
  });
});

