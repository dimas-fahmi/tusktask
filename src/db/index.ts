import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import schema from "./schema";

const connectionString = process.env.SECRET_SUPABASE_DB_URI;

if (!connectionString) {
  throw new Error("CONNECTION_STRING_INVALID_OR_UNAVAILABLE!");
}

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
