import { drizzle as nidbDrizzle } from "drizzle-orm/neon-http";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import {
  drizzle as idbDrizzle,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "../app/env";
import { relations } from "./schema/relations";

const DB_URL = getEnv("DATABASE_URL");

const pg_client = postgres(DB_URL, {
  prepare: false,
});

export const idb = idbDrizzle({
  client: pg_client,
  relations,
});

export const nidb =
  process.env.NODE_ENV === "production"
    ? nidbDrizzle(DB_URL, {
        relations,
      })
    : idb;

export type AsyncTransaction = PgAsyncTransaction<
  PostgresJsQueryResultHKT,
  typeof relations
>;
