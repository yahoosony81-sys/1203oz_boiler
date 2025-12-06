import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

// 동적 렌더링 강제 (Clerk auth 필요)
export const dynamic = "force-dynamic";

/**
 * Clerk 사용자를 Supabase users 테이블에 동기화하는 API
 *
 * 클라이언트에서 로그인 후 이 API를 호출하여 사용자 정보를 Supabase에 저장합니다.
 * 이미 존재하는 경우 업데이트하고, 없으면 새로 생성합니다.
 */
export async function POST() {
  console.group("[sync-user] 사용자 동기화 시작");
  
  try {
    // Clerk 인증 확인
    console.log("1. Clerk 인증 확인 중...");
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      console.error("❌ Sync user: No userId found in auth result");
      console.groupEnd();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("✅ Clerk 인증 성공, userId:", userId);

    // Clerk에서 사용자 정보 가져오기
    console.log("2. Clerk에서 사용자 정보 조회 중...");
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser) {
      console.error("❌ Clerk 사용자를 찾을 수 없음");
      console.groupEnd();
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("✅ Clerk 사용자 정보 조회 성공:", {
      id: clerkUser.id,
      name: clerkUser.fullName || clerkUser.username,
      email: clerkUser.emailAddresses[0]?.emailAddress,
    });

    // Supabase 클라이언트 초기화 확인
    console.log("3. Supabase 클라이언트 초기화 중...");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("❌ Supabase 환경 변수 누락:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceRoleKey,
      });
      console.groupEnd();
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    console.log("✅ Supabase 환경 변수 확인 완료");

    const supabase = getServiceRoleClient();

    // 사용자 이름 결정
    const userName =
      clerkUser.fullName ||
      clerkUser.username ||
      clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "Unknown";

    // 전화번호 추출 (Clerk에서)
    const phoneNumber = clerkUser.phoneNumbers[0]?.phoneNumber || null;

    console.log("4. Supabase에 사용자 정보 동기화 중...", {
      clerk_id: clerkUser.id,
      name: userName,
      phone: phoneNumber,
    });

    // Supabase에 사용자 정보 동기화
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          clerk_id: clerkUser.id,
          name: userName,
          phone: phoneNumber,
          // role과 is_verified는 기본값이 있으므로 명시하지 않음
        },
        {
          onConflict: "clerk_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase sync error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      console.groupEnd();
      return NextResponse.json(
        { 
          error: "Failed to sync user", 
          details: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    console.log("✅ 사용자 동기화 성공:", data);
    console.groupEnd();

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error("❌ Sync user error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });
    console.groupEnd();
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
