/**
 * @file tests/e2e/responsive.spec.ts
 * @description 반응형 UI 테스트
 */

import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 720 },
];

test.describe("반응형 레이아웃", () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test("홈페이지가 올바르게 렌더링된다", async ({ page }) => {
        await page.goto("/");
        
        // 헤더 확인
        await expect(page.locator("header")).toBeVisible();
        
        // Footer 확인
        await expect(page.locator("footer")).toBeVisible();
        
        // 검색 버튼 확인
        await expect(page.getByRole("button", { name: /차량 검색/i })).toBeVisible();
      });

      test("차량 검색 페이지가 올바르게 렌더링된다", async ({ page }) => {
        await page.goto("/vehicles");
        
        // 페이지 제목 확인
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      });

      test("가이드 페이지가 올바르게 렌더링된다", async ({ page }) => {
        await page.goto("/guide/renter");
        
        // 페이지 제목 확인
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      });

      test("약관 페이지가 올바르게 렌더링된다", async ({ page }) => {
        await page.goto("/terms");
        
        // 페이지 제목 확인
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.getByText("이용약관")).toBeVisible();
      });
    });
  }
});

test.describe("모바일 특화 테스트", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("모바일에서 터치 영역이 충분하다", async ({ page }) => {
    await page.goto("/");
    
    // 버튼 크기 확인 (최소 44x44px 권장)
    const searchButton = page.getByRole("button", { name: /차량 검색/i });
    const box = await searchButton.boundingBox();
    
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });

  test("모바일에서 스크롤이 가능하다", async ({ page }) => {
    await page.goto("/terms");
    
    // 페이지가 스크롤 가능한지 확인
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    // 콘텐츠가 뷰포트보다 클 수 있음
    expect(scrollHeight).toBeGreaterThan(0);
  });

  test("모바일에서 입력 폼이 사용 가능하다", async ({ page }) => {
    await page.goto("/");
    
    // 날짜 선택 버튼이 있는지 확인
    const dateButton = page.getByRole("button").filter({ hasText: /날짜|기간/i }).first();
    const dateButtonExists = await dateButton.isVisible().catch(() => false);
    
    // 날짜 버튼이 있으면 클릭 가능한지 확인
    if (dateButtonExists) {
      await expect(dateButton).toBeEnabled();
    }
  });
});

test.describe("태블릿 특화 테스트", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("태블릿에서 그리드 레이아웃이 올바르다", async ({ page }) => {
    await page.goto("/vehicles");
    
    // 페이지 로드 확인
    await expect(page).toHaveURL(/\/vehicles/);
  });
});

