import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { StandardError } from "./src/lib/app/errors";

config({ path: ".env" });

const connectionString = process.env.SECRET_SUPABASE_DATABASE_URI;

if (!connectionString) {
  throw new StandardError(
    "invalid_variable",
    "connectionString is invalid or unavailable",
  );
}

export default defineConfig({
  schema: "./src/db/schema",
  out: "./src/migrations/supabase",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
