"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * 공식 문서 패턴: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 * Clerk 통합: https://clerk.com/docs/guides/development/integrations/databases/supabase
 *
 * 2025년 권장 방식:
 * - @supabase/ssr의 createBrowserClient 사용 (자동 Cookie 처리)
 * - Clerk 세션 토큰을 accessToken으로 전달하여 RLS 정책에서 사용
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 * import { useUser } from '@clerk/nextjs';
 *
 * export default function MyComponent() {
 *   const { user } = useUser();
 *   const supabase = useClerkSupabaseClient();
 *
 *   useEffect(() => {
 *     if (!user) return;
 *
 *     async function fetchData() {
 *       const { data } = await supabase.from('table').select('*');
 *       console.log(data);
 *     }
 *
 *     fetchData();
 *   }, [user, supabase]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { session, isLoaded } = useSession();

  const supabase = useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // Clerk 토큰을 accessToken으로 전달하여 RLS 정책에서 사용
        async accessToken() {
          // 세션이 로드되지 않았거나 없으면 null 반환
          if (!isLoaded || !session) {
            return null;
          }
          try {
            return (await session.getToken()) ?? null;
          } catch (error) {
            console.error("Error getting Clerk token:", error);
            return null;
          }
        },
        // Clerk 인증을 사용하므로 Supabase 자체 인증 시스템 비활성화
        // 이렇게 하면 onAuthStateChange 경고가 발생하지 않습니다
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
  }, [session, isLoaded]);

  return supabase;
}

/**
 * 순수 Supabase 인증용 클라이언트 (Clerk 없이 Supabase 자체 인증 사용 시)
 *
 * 공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useSupabaseClient();
 *
 *   async function signIn() {
 *     await supabase.auth.signInWithPassword({
 *       email: 'user@example.com',
 *       password: 'password',
 *     });
 *   }
 *
 *   return <button onClick={signIn}>Sign In</button>;
 * }
 * ```
 */
export function useSupabaseClient() {
  return useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);
}
