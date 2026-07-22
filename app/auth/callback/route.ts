import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_auth_code", request.url)
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Google authentication callback failed:", error.message);

    return NextResponse.redirect(
      new URL("/login?error=google_login_failed", request.url)
    );
  }

  return NextResponse.redirect(new URL("/app", request.url));
}