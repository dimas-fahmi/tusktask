import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { StandardError } from "../lib/app/errors";
import { schema } from "./schema";

const connectionString = process.env.SECRET_SUPABASE_DB_URI;

if (!connectionString) {
  throw new StandardError(
    "invalid_variable",
    "connectionString is invalid or doesn't exist",
  );
}

const client = postgres(connectionString);
export const db = drizzle({ client, schema });
