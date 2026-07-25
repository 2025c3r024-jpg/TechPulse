import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser (client-side) Supabase client.
 * We intentionally omit the Database generic — the @supabase/supabase-js v2
 * generic inference conflicts with strict TypeScript when tables have Update:never
 * or complex join selects. Explicit types are applied at usage sites via type casts.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
