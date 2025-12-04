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
  try {
    // Clerk 인증 확인
    const authResult = await auth();
    const userId = authResult?.userId;

    if (!userId) {
      console.error("Sync user: No userId found in auth result");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clerk에서 사용자 정보 가져오기
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Supabase에 사용자 정보 동기화
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          clerk_id: clerkUser.id,
          name:
            clerkUser.fullName ||
            clerkUser.username ||
            clerkUser.emailAddresses[0]?.emailAddress ||
            "Unknown",
        },
        {
          onConflict: "clerk_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase sync error:", error);
      return NextResponse.json(
        { error: "Failed to sync user", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error("Sync user error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      type: error instanceof Error ? error.constructor.name : typeof error,
    });
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
