import { drizzle as nidbDrizzle } from "drizzle-orm/neon-http";
import { drizzle as idbDrizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "../app/env";
import { relations } from "./schema/relations";

const DB_URL = getEnv("DATABASE_URL");

export const nidb = nidbDrizzle(DB_URL, {
  relations,
});

const pg_client = postgres(DB_URL, {
  prepare: false,
});

export const idb = idbDrizzle({
  client: pg_client,
  relations,
});
