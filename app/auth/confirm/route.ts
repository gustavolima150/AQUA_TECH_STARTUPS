import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const url = new URL("/app", request.url);
  if (token_hash && type && ["email", "recovery", "invite", "magiclink", "email_change"].includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) return NextResponse.redirect(type === "recovery" ? new URL("/nova-senha", request.url) : url);
  }
  return NextResponse.redirect(new URL("/entrar?erro=confirmacao", request.url));
}
