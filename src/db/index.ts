import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

type Db = NeonDatabase<typeof schema>;

let _db: Db | null = null;
let _dbPromise: Promise<Db> | null = null;

/**
 * Lazy DB connection.
 * Delays require("drizzle-orm/neon-serverless") (and thus
 * @neondatabase/serverless) until the first actual DB query —
 * so Vercel's build step never loads native serverless drivers.
 */
function getDb(): Promise<Db> | Db {
  if (_db) return _db;
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        console.warn(
          "⚠ DATABASE_URL not set — admin pages will show 'not configured' state.",
        );
        return new Proxy({} as any, {
          get(_target, prop) {
            if (prop === "then") return undefined;
            throw new Error(
              `Database not configured (missing DATABASE_URL). Tried to access .${String(prop)}`,
            );
          },
        }) as any;
      }
      const { drizzle } = await import("drizzle-orm/neon-serverless");
      _db = drizzle(connectionString, { schema }) as Db;
      return _db;
    })();
  }
  return _dbPromise;
}

// Proxy that makes `db.select()...` work transparently
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    if (prop === "then") return undefined;
    const resolved = getDb();
    if (resolved instanceof Promise) {
      // When used with .then() — resolve first
      return (...args: unknown[]) =>
        resolved.then((db) => {
          const val = (db as any)[prop];
          return typeof val === "function" ? val.apply(db, args) : val;
        });
    }
    return Reflect.get(resolved, prop, resolved);
  },
}) as Db;
