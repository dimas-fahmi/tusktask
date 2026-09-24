import { defineConfig } from "drizzle-kit";
import { getEnv } from "./src/app/env";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: getEnv("DATABASE_URL"),
  },
});
