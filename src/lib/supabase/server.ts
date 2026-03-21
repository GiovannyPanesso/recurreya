import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con service_role para uso exclusivo en API routes y server actions
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
