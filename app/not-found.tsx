import Link from "next/link";
import { Button } from "@/components/ui/button";

// 빌드 시 사전 렌더링 건너뛰기
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-gray-500 dark:text-gray-500 text-center max-w-md">
        요청하신 페이지가 존재하지 않거나 삭제되었습니다.
      </p>
      <Link href="/">
        <Button>홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}

