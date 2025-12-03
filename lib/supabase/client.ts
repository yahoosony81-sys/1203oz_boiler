import { createBrowserClient } from "@supabase/ssr";

/**
 * 공개 데이터용 Supabase 클라이언트 (인증 불필요)
 *
 * 공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 *
 * RLS 정책이 `to anon`인 공개 데이터에 접근할 때 사용합니다.
 * 인증이 필요한 데이터는 useClerkSupabaseClient() 또는 createClerkSupabaseClient()를 사용하세요.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { supabase } from '@/lib/supabase/client';
 *
 * export default function PublicData() {
 *   useEffect(() => {
 *     async function fetchPublicData() {
 *       const { data } = await supabase
 *         .from('public_posts')
 *         .select('*');
 *       console.log(data);
 *     }
 *     fetchPublicData();
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
