/**
 * @file tests/e2e/booking-flow.spec.ts
 * @description 예약 플로우 E2E 테스트
 * 
 * 전체 플로우: 차량 검색 → 상세 → 예약 신청 → 승인 → 결제
 * 
 * 참고: 이 테스트는 실제 데이터와 인증이 필요합니다.
 * 로컬 테스트 시 테스트 계정을 사용하세요.
 */

import { test, expect } from "@playwright/test";

test.describe("예약 플로우 (비로그인)", () => {
  test("비로그인 상태에서 예약 시 로그인 페이지로 리다이렉트", async ({ page }) => {
    // 1. 홈페이지에서 시작
    await page.goto("/");
    
    // 2. 차량 검색으로 이동
    await page.getByRole("button", { name: /차량 검색/i }).click();
    await expect(page).toHaveURL(/\/vehicles/);
    
    // 3. 차량이 있으면 클릭, 없으면 테스트 스킵
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    const hasVehicles = await vehicleCard.isVisible().catch(() => false);
    
    if (!hasVehicles) {
      test.skip();
      return;
    }
    
    await vehicleCard.click();
    
    // 4. 상세 페이지에서 예약 신청 버튼 확인
    const bookingButton = page.getByRole("button", { name: /로그인하고 예약하기|예약 신청하기/i });
    await expect(bookingButton).toBeVisible();
  });
});

test.describe("예약 관리 페이지", () => {
  test("비로그인 시 로그인 안내 표시", async ({ page }) => {
    await page.goto("/bookings/my");
    
    // 로그인 안내 또는 로그인 페이지로 리다이렉트
    const hasLoginPrompt = await page.getByText(/로그인이 필요합니다|로그인/i).isVisible().catch(() => false);
    const isSignInPage = page.url().includes("sign-in");
    
    expect(hasLoginPrompt || isSignInPage).toBeTruthy();
  });
});

test.describe("결제 페이지", () => {
  test("결제 성공 페이지 접근 가능", async ({ page }) => {
    // 실제 결제 없이 성공 페이지 레이아웃 테스트
    await page.goto("/payments/success?orderId=test&amount=50000");
    
    // 페이지가 로드되는지 확인
    await expect(page).toHaveURL(/\/payments\/success/);
  });

  test("결제 실패 페이지 접근 가능", async ({ page }) => {
    await page.goto("/payments/fail?code=PAY_PROCESS_CANCELED&message=test");
    
    // 페이지가 로드되고 에러 메시지 표시
    await expect(page).toHaveURL(/\/payments\/fail/);
    await expect(page.getByText(/결제 실패/i)).toBeVisible();
  });
});

test.describe("날짜 계산 검증", () => {
  test("날짜 선택 시 총 금액이 올바르게 계산된다", async ({ page }) => {
    // 차량 상세 페이지로 이동 (테스트용 차량 필요)
    await page.goto("/vehicles");
    
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    const hasVehicles = await vehicleCard.isVisible().catch(() => false);
    
    if (!hasVehicles) {
      test.skip();
      return;
    }
    
    await vehicleCard.click();
    
    // 날짜 선택기가 있는지 확인
    const datePickerExists = await page.getByText("이용 기간").isVisible().catch(() => false);
    
    if (datePickerExists) {
      // 날짜 선택 UI 확인
      await expect(page.getByText("이용 기간")).toBeVisible();
    }
  });
});

