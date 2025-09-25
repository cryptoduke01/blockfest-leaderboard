import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string | undefined;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE as string | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Supabase env not set (SUPABASE_URL, SUPABASE_SERVICE_ROLE). Returning null client; API will return empty results."
      );
      return null;
    }
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variables"
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export const supabaseAdmin = getSupabaseAdmin();
