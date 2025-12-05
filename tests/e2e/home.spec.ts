/**
 * @file tests/e2e/home.spec.ts
 * @description 홈페이지 E2E 테스트
 */

import { test, expect } from "@playwright/test";

test.describe("홈페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("페이지 타이틀이 올바르게 표시된다", async ({ page }) => {
    await expect(page).toHaveTitle(/TripCarShare/);
  });

  test("네비게이션 바가 표시된다", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByRole("link", { name: /TripCarShare/i })).toBeVisible();
  });

  test("차량 검색 폼이 표시된다", async ({ page }) => {
    // 날짜 선택기
    await expect(page.getByText("이용 기간")).toBeVisible();
    
    // 공항 선택
    await expect(page.getByText("공항")).toBeVisible();
    
    // 검색 버튼
    await expect(page.getByRole("button", { name: /차량 검색/i })).toBeVisible();
  });

  test("Footer가 표시된다", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.getByText("TripCarShare")).toBeVisible();
  });

  test("차량 검색 버튼 클릭 시 검색 결과 페이지로 이동한다", async ({ page }) => {
    // 검색 버튼 클릭
    await page.getByRole("button", { name: /차량 검색/i }).click();
    
    // URL 확인
    await expect(page).toHaveURL(/\/vehicles/);
  });
});

test.describe("홈페이지 - 모바일", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("모바일에서 네비게이션이 올바르게 표시된다", async ({ page }) => {
    await page.goto("/");
    
    // 헤더가 보이는지 확인
    await expect(page.locator("header")).toBeVisible();
  });

  test("모바일에서 검색 폼이 세로로 배치된다", async ({ page }) => {
    await page.goto("/");
    
    // 검색 폼이 보이는지 확인
    await expect(page.getByRole("button", { name: /차량 검색/i })).toBeVisible();
  });
});

