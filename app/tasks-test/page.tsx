"use client";

/**
 * @file app/tasks-test/page.tsx
 * @description Clerk + Supabase 통합 테스트 페이지
 *
 * 이 페이지는 Clerk와 Supabase의 네이티브 통합을 테스트하는 예제입니다.
 * 공식 문서: https://clerk.com/docs/guides/development/integrations/databases/supabase
 *
 * 주요 기능:
 * 1. Clerk 인증 상태 확인
 * 2. Supabase tasks 테이블에서 사용자별 tasks 조회
 * 3. 새 task 생성
 * 4. RLS 정책이 올바르게 작동하는지 확인
 *
 * 핵심 구현 로직:
 * - useClerkSupabaseClient()로 Clerk 토큰이 포함된 Supabase 클라이언트 사용
 * - useUser()와 useSession()으로 인증 상태 확인
 * - tasks 테이블의 user_id는 auth.jwt()->>'sub'로 자동 설정됨
 *
 * @dependencies
 * - @clerk/nextjs: Clerk 인증
 * - @supabase/supabase-js: Supabase 클라이언트
 * - @/lib/supabase/clerk-client: Clerk + Supabase 통합 클라이언트
 */

import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, CheckCircle2, AlertCircle } from "lucide-react";

interface Task {
  id: number;
  name: string;
  user_id: string;
  created_at: string;
}

export default function TasksTestPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clerk 인증 상태 확인
  const { user, isLoaded: userLoaded } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();

  // Clerk 토큰이 포함된 Supabase 클라이언트 생성
  const supabase = useClerkSupabaseClient();

  // Tasks 로드
  useEffect(() => {
    if (!user || !userLoaded || !sessionLoaded) return;

    async function loadTasks() {
      try {
        setLoading(true);
        setError(null);

        console.group("🔍 Tasks 조회 시작");
        console.log("User ID:", user.id);
        console.log("Session:", session ? "활성화됨" : "없음");

        const { data, error: fetchError } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("❌ Tasks 조회 실패:", fetchError);
          setError(`Tasks 조회 실패: ${fetchError.message}`);
          return;
        }

        console.log("✅ Tasks 조회 성공:", data);
        console.groupEnd();

        if (data) {
          setTasks(data);
        }
      } catch (err) {
        console.error("❌ 예상치 못한 에러:", err);
        setError(`예상치 못한 에러: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [user, userLoaded, sessionLoaded, supabase, session]);

  // 새 Task 생성
  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!taskName.trim()) {
      setError("Task 이름을 입력해주세요.");
      return;
    }

    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      console.group("➕ Task 생성 시작");
      console.log("Task 이름:", taskName);
      console.log("User ID:", user.id);

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          name: taskName,
          // user_id는 데이터베이스에서 자동으로 auth.jwt()->>'sub'로 설정됨
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Task 생성 실패:", insertError);
        setError(`Task 생성 실패: ${insertError.message}`);
        console.groupEnd();
        return;
      }

      console.log("✅ Task 생성 성공:", data);
      console.groupEnd();

      // 새로 생성된 task를 목록에 추가
      if (data) {
        setTasks((prev) => [data, ...prev]);
      }

      // 입력 필드 초기화
      setTaskName("");
    } catch (err) {
      console.error("❌ 예상치 못한 에러:", err);
      setError(`예상치 못한 에러: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsCreating(false);
    }
  }

  // 로딩 중
  if (!userLoaded || !sessionLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-16 h-16 text-yellow-500" />
        <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
        <p className="text-gray-600">
          Tasks 기능을 사용하려면 먼저 로그인해주세요.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-2">Clerk + Supabase 통합 테스트</h1>
        <p className="text-gray-600 mb-4">
          공식 문서의 모범 사례를 따라 구현된 Tasks 예제입니다.
        </p>
        <div className="text-sm text-gray-500 space-y-1">
          <p>
            <strong>사용자 ID:</strong> {user.id}
          </p>
          <p>
            <strong>이메일:</strong> {user.primaryEmailAddress?.emailAddress}
          </p>
          <p>
            <strong>세션 상태:</strong>{" "}
            {session ? (
              <span className="text-green-600">활성화됨</span>
            ) : (
              <span className="text-red-600">없음</span>
            )}
          </p>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800">에러</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="text-red-600"
          >
            닫기
          </Button>
        </div>
      )}

      {/* Task 생성 폼 */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          새 Task 생성
        </h2>
        <form onSubmit={createTask} className="flex gap-2">
          <Input
            type="text"
            placeholder="Task 이름을 입력하세요"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            disabled={isCreating}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" disabled={isCreating || !taskName.trim()}>
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                추가
              </>
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          💡 user_id는 데이터베이스에서 자동으로 Clerk 사용자 ID로 설정됩니다.
        </p>
      </div>

      {/* Tasks 목록 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">내 Tasks</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Tasks를 불러오는 중...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-gray-600">아직 생성된 Task가 없습니다.</p>
            <p className="text-sm text-gray-500 mt-2">
              위 폼을 사용하여 새 Task를 생성해보세요.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{task.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>
                        <strong>Task ID:</strong> {task.id}
                      </p>
                      <p>
                        <strong>User ID:</strong> {task.user_id}
                      </p>
                      <p>
                        <strong>생성일:</strong>{" "}
                        {new Date(task.created_at).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 정보 섹션 */}
      <div className="mt-8 p-6 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <h3 className="text-lg font-semibold mb-2">📚 통합 정보</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            ✅ <strong>Clerk 인증:</strong> useUser()와 useSession()으로 인증 상태 확인
          </li>
          <li>
            ✅ <strong>Supabase 클라이언트:</strong> useClerkSupabaseClient()로 Clerk
            토큰이 포함된 클라이언트 사용
          </li>
          <li>
            ✅ <strong>RLS 정책:</strong>{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
              auth.jwt()-&gt;&gt;&apos;sub&apos;
            </code>{" "}
            로 사용자별 데이터 접근 제한
          </li>
          <li>
            ✅ <strong>자동 user_id 설정:</strong> 데이터베이스에서{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
              DEFAULT auth.jwt()-&gt;&gt;&apos;sub&apos;
            </code>{" "}
            로 자동 설정
          </li>
        </ul>
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
          <p>
            📖{" "}
            <a
              href="https://clerk.com/docs/guides/development/integrations/databases/supabase"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              공식 문서 보기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

