/**
 * @file app/instruments/page.tsx
 * @description Supabase 공식 문서 예제 페이지
 *
 * 공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 *
 * 이 페이지는 Supabase 공식 문서의 예제를 따라 구현되었습니다.
 * instruments 테이블의 데이터를 조회하여 표시합니다.
 *
 * 주요 기능:
 * 1. Server Component에서 Supabase 데이터 조회
 * 2. Suspense를 사용한 로딩 상태 처리
 * 3. 공식 문서의 모범 사례 패턴 적용
 *
 * @dependencies
 * - @supabase/ssr: SSR용 Supabase 클라이언트
 * - next/headers: cookies() 함수
 */

import { createSupabaseClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music } from "lucide-react";

async function InstrumentsData() {
  const supabase = await createSupabaseClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <h3 className="text-lg font-semibold text-red-800 mb-2">에러 발생</h3>
        <p className="text-sm text-red-700">{error.message}</p>
        <p className="text-xs text-red-600 mt-2">
          💡 instruments 테이블이 생성되었는지 확인하세요.
        </p>
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="p-6 border border-yellow-200 rounded-lg bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          데이터가 없습니다
        </h3>
        <p className="text-sm text-yellow-700">
          instruments 테이블에 데이터를 추가해주세요.
        </p>
        <div className="mt-4 text-xs text-yellow-600">
          <p className="font-semibold mb-2">SQL Editor에서 실행:</p>
          <pre className="bg-yellow-100 p-3 rounded overflow-x-auto">
            {`INSERT INTO instruments (name)
VALUES
  ('violin'),
  ('viola'),
  ('cello');`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instruments.map((instrument: { id: number; name: string }) => (
          <div
            key={instrument.id}
            className="p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{instrument.name}</p>
                <p className="text-xs text-gray-500">ID: {instrument.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <h3 className="text-sm font-semibold mb-2">📊 데이터 정보</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          총 <strong>{instruments.length}개</strong>의 악기가 조회되었습니다.
        </p>
      </div>

      <details className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <summary className="cursor-pointer font-semibold mb-2">
          📋 원시 데이터 보기
        </summary>
        <pre className="mt-2 text-xs overflow-x-auto bg-white dark:bg-gray-800 p-3 rounded">
          {JSON.stringify(instruments, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default function Instruments() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <Link href="/" className="inline-block mb-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Instruments</h1>
        <p className="text-gray-600 mb-4">
          Supabase 공식 문서 예제를 따라 구현된 페이지입니다.
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            📖{" "}
            <a
              href="https://supabase.com/docs/guides/getting-started/quickstarts/nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              공식 문서 보기
            </a>
          </p>
          <p>
            💡 이 페이지는 Server Component에서 Supabase 데이터를 직접 조회합니다.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Instruments를 불러오는 중...</p>
            </div>
          </div>
        }
      >
        <InstrumentsData />
      </Suspense>
    </div>
  );
}

