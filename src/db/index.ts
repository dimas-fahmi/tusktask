import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL doesn't exist");
}

export const db = drizzle(process.env.DATABASE_URL);
