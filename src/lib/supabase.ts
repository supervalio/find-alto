import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Return a stub that logs errors instead of crashing.
    // Real values must be set in Vercel Environment Variables.
    if (typeof window === "undefined") {
      console.warn(
        "⚠️ Supabase env vars missing — uploads won't work until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
      );
    }
    return null;
  }

  return createClient(url, anonKey);
}

export const supabase = getSupabase();
