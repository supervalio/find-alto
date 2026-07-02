import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Lazy DB — only used by admin pages.
// Returns a no-op mock when DATABASE_URL is not set,
// so admin pages don't crash but show "not configured" state.
function createDb() {
  if (!connectionString) {
    console.warn(
      "⚠ DATABASE_URL not set — admin pages will show 'not configured' state.",
    );
    // Return a proxy that throws descriptive errors for admin callers
    return new Proxy({} as any, {
      get(_target, prop) {
        if (prop === "then") return undefined;
        throw new Error(
          `Database not configured (missing DATABASE_URL). Tried to access .${String(prop)}`,
        );
      },
    }) as any;
  }
  return drizzle(connectionString, { schema });
}

export const db = createDb();
