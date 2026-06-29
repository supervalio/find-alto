import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Lazy DB — only used by admin pages.
// Does NOT throw at import time to avoid breaking Vercel builds
// when DATABASE_URL is not set for public routes.
export const db = connectionString
  ? drizzle(connectionString, { schema })
  : (null as any);
