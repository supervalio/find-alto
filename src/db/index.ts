import * as schema from "./schema";
import type { PgDatabase } from "drizzle-orm/pg-core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = PgDatabase<any, typeof schema>;

let _db: Db | null = null;
let _dbPromise: Promise<Db> | null = null;

function getDb(): Promise<Db> | Db {
  if (_db) return _db;
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        console.warn("⚠ DATABASE_URL not set — admin pages unavailable.");
        return new Proxy({} as any, {
          get(_target, prop) {
            if (prop === "then") return undefined;
            throw new Error(
              `Database not configured (missing DATABASE_URL). Tried to access .${String(prop)}`,
            );
          },
        }) as any;
      }
      const { drizzle } = await import("drizzle-orm/postgres-js");
      const postgres = (await import("postgres")).default;
      const client = postgres(connectionString);
      _db = drizzle(client, { schema }) as Db;
      return _db;
    })();
  }
  return _dbPromise;
}

// Proxy that makes db.select()... work transparently
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    if (prop === "then") return undefined;
    const resolved = getDb();
    if (resolved instanceof Promise) {
      return (...args: unknown[]) =>
        resolved.then((db) => {
          const val = (db as any)[prop];
          return typeof val === "function" ? val.apply(db, args) : val;
        });
    }
    return Reflect.get(resolved, prop, resolved);
  },
}) as Db;
