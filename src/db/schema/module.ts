import { type PgTimestampConfig, pgSchema } from "drizzle-orm/pg-core";
import { COLOR_THEME_IDS } from "@/src/app/colorTheme";
import { REGISTRATION_STEPS } from "@/src/app/registrationPhase";

// SCHEMA
export const appSchema = pgSchema("app");
export const authSchema = pgSchema("auth");

// CONFIGS
export const TIMESTAMPZ_CONFIG: PgTimestampConfig = {
  precision: 6,
  withTimezone: true,
} as const;

// ENUMS
export const colorThemeIdEnum = authSchema.enum(
  "color_theme_enum",
  COLOR_THEME_IDS,
);

export const registrationStepEnum = authSchema.enum(
  "registration_step_enum",
  REGISTRATION_STEPS,
);
