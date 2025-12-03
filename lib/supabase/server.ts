import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * 공식 문서 패턴: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * Clerk 통합: https://clerk.com/docs/guides/development/integrations/databases/supabase
 *
 * 2025년 권장 방식:
 * - @supabase/ssr의 createServerClient 사용 (Cookie-based auth 지원)
 * - Clerk 토큰을 accessToken으로 전달하여 RLS 정책에서 사용
 * - Next.js 15 App Router의 cookies() 사용
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClerkSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export async function createClerkSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Component에서는 읽기 전용이므로 경고만 발생
          // 세션 갱신은 middleware에서 처리해야 함
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서는 쿠키 설정이 제한될 수 있음
            // 이는 정상적인 동작이며, middleware에서 처리해야 함
          }
        },
      },
      // Clerk 토큰을 accessToken으로 전달하여 RLS 정책에서 사용
      async accessToken() {
        return (await auth()).getToken() ?? null;
      },
    }
  );
}

/**
 * 순수 Supabase 인증용 클라이언트 (Clerk 없이 Supabase 자체 인증 사용 시)
 *
 * 공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 *
 * @example
 * ```tsx
 * import { createSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createSupabaseClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   return <div>Welcome {user?.email}</div>;
 * }
 * ```
 */
export async function createSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component에서는 쿠키 설정이 제한될 수 있음
          }
        },
      },
    }
  );
}
