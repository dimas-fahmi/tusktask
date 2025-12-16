import { z } from "zod";
import { projectSchema } from "@/src/db/schema/project";
import { taskSchema } from "@/src/db/schema/task";
import { PROJECT_MEMBERSHIP_ROLES } from "../app/projectRBAC";
import { sanitizedUserTypeSchema } from ".";

export const notificationMessageTypeSchema = z.object({
  subject: z.string().max(99).optional(),
  message: z.string().max(280).optional(),
});
export type NotificationMessageType = z.infer<
  typeof notificationMessageTypeSchema
>;

export const projectMembershipRoleTypeSchema = z.enum(PROJECT_MEMBERSHIP_ROLES);
export type ProjectMembershipRoleType = z.infer<
  typeof projectMembershipRoleTypeSchema
>;

export const notificationPayloadSchema = z.union([
  // invited_to_a_project
  z.object({
    event: z.literal("invited_to_a_project"),
    actor: sanitizedUserTypeSchema,
    target: sanitizedUserTypeSchema,
    project: projectSchema,
    role: projectMembershipRoleTypeSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // requested_a_promotion
  z.object({
    event: z.literal("requested_a_promotion"),
    actor: sanitizedUserTypeSchema,
    project: projectSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // promoted
  z.object({
    event: z.literal("promoted"),
    actor: sanitizedUserTypeSchema,
    target: sanitizedUserTypeSchema,
    project: projectSchema,
    roleBefore: projectMembershipRoleTypeSchema,
    roleNow: projectMembershipRoleTypeSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // demoted
  z.object({
    event: z.literal("demoted"),
    actor: sanitizedUserTypeSchema,
    target: sanitizedUserTypeSchema,
    project: projectSchema,
    roleBefore: projectMembershipRoleTypeSchema,
    roleNow: projectMembershipRoleTypeSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // suspended
  z.object({
    event: z.literal("demoted"),
    actor: sanitizedUserTypeSchema,
    target: sanitizedUserTypeSchema,
    project: projectSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // claimed_a_task
  z.object({
    event: z.literal("claimed_a_task"),
    actor: sanitizedUserTypeSchema,
    project: projectSchema,
    task: taskSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // assigned_a_task
  z.object({
    event: z.literal("assigned_a_task"),
    actor: sanitizedUserTypeSchema,
    target: sanitizedUserTypeSchema,
    project: projectSchema,
    task: taskSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // updated_a_task
  z.object({
    event: z.literal("updated_a_task"),
    actor: sanitizedUserTypeSchema,
    project: projectSchema,
    task: taskSchema,
    message: notificationMessageTypeSchema.optional(),
  }),

  // message
  z.object({
    event: z.literal("message"),
    actor: z.union([sanitizedUserTypeSchema, z.literal("system")]),
    project: projectSchema.optional(),
    task: taskSchema.optional(),
    message: notificationMessageTypeSchema,
  }),
]);
export type NotificationPayloadType = z.infer<typeof notificationPayloadSchema>;

export type NotificationEventType = NotificationPayloadType["event"];
