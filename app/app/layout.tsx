import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceProvider } from "@/components/workspace-provider";
import { AppShell } from "@/components/app-shell";
export const dynamic = "force-dynamic";
export default async function AppLayout({children}:{children:React.ReactNode}) {
  const supabase = await createClient();
  const {data:{user},error} = await supabase.auth.getUser();
  if (error || !user || !user.email_confirmed_at) redirect("/entrar");
  return <WorkspaceProvider><AppShell>{children}</AppShell></WorkspaceProvider>;
}
