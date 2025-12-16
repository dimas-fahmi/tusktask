import { type PgTimestampConfig, pgEnum, pgSchema } from "drizzle-orm/pg-core";
import { APP_COLOR_THEMES } from "@/src/lib/app/color-themes";
import { PROJECT_MEMBERSHIP_ROLES } from "@/src/lib/app/projectRBAC";

// Onboarding Phases
export const onboardingPhases = [
  "name",
  "username",
  "image",
  "settings",
  "completed",
] as const;

export type OnboardingPhaseType = (typeof onboardingPhases)[number];

// Task Status Enums
export const TASK_STATUSES = [
  "pending",
  "on_process",
  "aborted",
  "delayed",
  "continued",
] as const;

export type TaskStatusType = (typeof TASK_STATUSES)[number];

// Timestamp config
export const defaultTimestampConfig: PgTimestampConfig = {
  mode: "date",
  precision: 6,
  withTimezone: true,
};

// SCHEMA
export const appAuthSchema = pgSchema("app_auth");

// ENUMS
export const onboardingStatusEnum = appAuthSchema.enum(
  "onboarding_status_enum",
  onboardingPhases,
);

export const mediaOwnershipEnum = pgEnum("media_ownership_enum", [
  "system",
  "user_owned",
]);

export const mediaStorageEnum = pgEnum("media_storage", [
  "internal",
  "external",
]);

export const themeEnum = appAuthSchema.enum("theme_enum", APP_COLOR_THEMES);

export const taskStatusEnum = pgEnum("task_status_enum", TASK_STATUSES);
export const projectMembershipTypeEnum = pgEnum(
  "project_membership_type_enum",
  PROJECT_MEMBERSHIP_ROLES,
);
