import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Neon serverless driver uses WebSocket — perfect for Vercel serverless
export const db = drizzle(connectionString, { schema });
