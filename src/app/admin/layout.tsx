import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin layout — enforces that the current user exists AND has role = 'admin'.
 * Every page under /admin is protected by this single layout.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/admin");

  // Fetch the user's profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null; error: unknown };

  if (!profile || profile.role !== "admin") {
    redirect("/403");
  }

  return <>{children}</>;
}
