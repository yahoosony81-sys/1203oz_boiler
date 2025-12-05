/**
 * @file playwright.config.ts
 * @description Playwright E2E 테스트 설정
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  
  // 각 테스트 최대 실행 시간
  timeout: 30 * 1000,
  
  // assertion 타임아웃
  expect: {
    timeout: 5000,
  },
  
  // 전체 테스트 최대 시간
  globalTimeout: 10 * 60 * 1000,
  
  // 병렬 실행
  fullyParallel: true,
  
  // 실패 시 재시도 (CI에서만)
  retries: process.env.CI ? 2 : 0,
  
  // 워커 수
  workers: process.env.CI ? 1 : undefined,
  
  // 리포터 설정
  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],
  
  // 공통 설정
  use: {
    // 기본 URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    
    // 추적 설정 (실패 시에만)
    trace: "on-first-retry",
    
    // 스크린샷 (실패 시에만)
    screenshot: "only-on-failure",
    
    // 비디오 (실패 시에만)
    video: "on-first-retry",
  },

  // 브라우저별 설정
  projects: [
    // Desktop Chrome
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    
    // Mobile Chrome (반응형 테스트)
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    
    // Mobile Safari (반응형 테스트)
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  // 개발 서버 자동 실행 (로컬)
  webServer: process.env.CI ? undefined : {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});

