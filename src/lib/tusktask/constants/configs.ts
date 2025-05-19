import { PgTimestampConfig } from "drizzle-orm/pg-core";

export const TIMESTAMP_CONFIGS: PgTimestampConfig = {
  mode: "date",
  precision: 6,
  withTimezone: true,
};
