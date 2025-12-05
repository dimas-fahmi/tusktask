import { type PgTimestampConfig, pgEnum, pgSchema } from "drizzle-orm/pg-core";

// Actions
export const notificationType = [
  "project_invitation",
  "created_new_task",
  "claimed_task",
  "assigned_task",
  "completed_task",
  "rejected_invitation",
  "joined_project",
  "left_project",
  "promoted_member",
  "demoted_member",
  "archived_task",
  "updated_task",
  "new_message",
  "system_alert",
  "generic_broadcast",
  "system_broadcast",
  "system_positive",
  "system_negative",
] as const;

export const onboardingPhases = [
  "name",
  "username",
  "image",
  "settings",
  "completed",
] as const;

export type OnboardingPhaseType = (typeof onboardingPhases)[number];

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
export const themeEnum = appAuthSchema.enum("theme_enum", [
  "default",
  "dark",
  "popBella",
  "brownBear",
  "cofeePuff",
  "jettBlack",
]);
export const notificationTypeEnum = pgEnum(
  "notification_type_enum",
  notificationType,
);
export const projectTypeEnum = pgEnum("project_type_enum", [
  "primary",
  "regular",
  "co-op",
]);
export const taskStatusEnum = pgEnum("task_status_enum", [
  "pending",
  "on_process",
  "aborted",
  "delayed",
  "continued",
]);
export const projectMembershipTypeEnum = pgEnum(
  "project_membership_type_enum",
  ["owner", "admin", "member", "observer"],
);
