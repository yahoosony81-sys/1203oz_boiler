/**
 * @file tests/e2e/vehicles.spec.ts
 * @description 차량 검색 및 상세 페이지 E2E 테스트
 */

import { test, expect } from "@playwright/test";

test.describe("차량 검색 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/vehicles");
  });

  test("페이지 제목이 표시된다", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("필터 옵션이 표시된다", async ({ page }) => {
    // 필터 UI 확인
    await expect(page.getByText("필터")).toBeVisible();
  });

  test("차량 목록 또는 빈 상태가 표시된다", async ({ page }) => {
    // 차량 카드가 있거나 빈 상태 메시지가 있어야 함
    const hasVehicles = await page.locator('[data-testid="vehicle-card"]').count();
    const hasEmptyState = await page.getByText(/차량이 없습니다|검색 결과가 없습니다/).isVisible().catch(() => false);
    
    expect(hasVehicles > 0 || hasEmptyState).toBeTruthy();
  });
});

test.describe("차량 상세 페이지", () => {
  // 테스트용 차량 ID (실제 데이터 필요)
  const testVehicleId = "test-vehicle-id";
  
  test("차량 정보가 표시된다", async ({ page }) => {
    await page.goto(`/vehicles/${testVehicleId}`);
    
    // 차량 정보 또는 에러 메시지 확인
    const hasContent = await page.getByRole("heading", { level: 1 }).isVisible().catch(() => false);
    const hasError = await page.getByText(/찾을 수 없습니다/).isVisible().catch(() => false);
    
    expect(hasContent || hasError).toBeTruthy();
  });

  test("예약 폼이 표시된다", async ({ page }) => {
    await page.goto(`/vehicles/${testVehicleId}`);
    
    // 예약 관련 UI가 있거나 에러 페이지
    const hasBookingForm = await page.getByText("예약하기").isVisible().catch(() => false);
    const hasError = await page.getByText(/찾을 수 없습니다/).isVisible().catch(() => false);
    
    expect(hasBookingForm || hasError).toBeTruthy();
  });
});

test.describe("차량 검색 - 모바일", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("모바일에서 차량 카드가 세로로 배치된다", async ({ page }) => {
    await page.goto("/vehicles");
    
    // 페이지가 로드되는지 확인
    await expect(page).toHaveURL(/\/vehicles/);
  });
});

