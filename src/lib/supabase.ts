import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Chainable no-op mock — returns { data: null, error } for every query.
 * Allows all Supabase method chains (.from().select().eq() etc.)
 * without crashing, so pages gracefully fall back to seed data.
 */
function createNoopClient(): SupabaseClient {
  const noopResult = Promise.resolve({
    data: null,
    error: new Error(
      "Supabase not configured — missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
  });

  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      if (prop === "then") return undefined;
      // Return a callable that produces a chainable mock or resolves to noopResult
      return new Proxy(() => {}, {
        get(_nestedTarget, nestedProp) {
          if (nestedProp === "then") return undefined;
          return new Proxy(() => {}, handler);
        },
        apply(_nestedTarget, _thisArg, _args) {
          // If accessed via .then() → resolve; otherwise return a new proxy for chaining
          return new Proxy({}, handler);
        },
      });
    },
    apply(_target, _thisArg, _args) {
      // Called when the top-level proxy is invoked as a function (shouldn't happen)
      return noopResult;
    },
  };

  return new Proxy({} as any, handler) as unknown as SupabaseClient;
}

function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "⚠ Supabase env vars missing — all DB calls return { data: null }. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
    return createNoopClient();
  }

  return createClient(supabaseUrl, supabaseKey);
}

export const supabase: SupabaseClient = createSupabaseClient();
