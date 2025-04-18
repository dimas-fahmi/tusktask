import { drizzle } from "drizzle-orm/neon-http";
import { schema } from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DB_CONNECTION IS NOT AVAILABLE");
}

export const db = drizzle(process.env.DATABASE_URL, { schema: schema });
