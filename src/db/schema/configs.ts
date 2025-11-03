import { type PgTimestampConfig, pgSchema } from "drizzle-orm/pg-core";

// Timestampt configs
export const TIMESTAMP_CONFIG: PgTimestampConfig = {
  mode: "date",
  precision: 3,
  withTimezone: true,
} as const;

// PG_SCHEMA
export const userSchema = pgSchema("user");
export const mainSchema = pgSchema("main");

// Enums
export const statusEnum = mainSchema.enum("status_enum", [
  "pending",
  "ongoing",
  "archived",
  "completed",
]);

export const projectStatusEnum = mainSchema.enum("project_status_enum", [
  "active",
  "archived",
]);
