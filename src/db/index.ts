import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DATABASE_URL) {
  throw new Error("DB_CONNECTION IS NOT AVAILABLE");
}

export const db = drizzle(process.env.DATABASE_URL);
