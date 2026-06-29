import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Lazy initialization: pool is created on first query, not at module load.
// Prevents build-time connection failures on Vercel serverless.
let _db: NodePgDatabase<typeof schema> | null = null;

function getDb(): NodePgDatabase<typeof schema> {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL!;
    // Supabase requires SSL for all connections
    const ssl = connectionString.includes("pooler.supabase.co")
      ? { rejectUnauthorized: false }
      : undefined;
    const pool = new Pool({
      connectionString,
      ssl,
      // Vercel serverless: limit connections
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
    _db = drizzle(pool, { schema });
  }
  return _db;
}

// Proxy so that `db.select().from(...)` still works as before
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    const real = getDb();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (real as any)[prop];
  },
}) as NodePgDatabase<typeof schema>;
