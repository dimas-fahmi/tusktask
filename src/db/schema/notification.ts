import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { NotificationPayloadType } from "@/src/lib/zod/notification";
import { user } from "./auth-schema";
import { defaultTimestampConfig, eventTypeEnum } from "./configs";
import { project } from "./project";
import { task } from "./task";

export const notification = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey(),
    payload: jsonb("payload").$type<NotificationPayloadType>().notNull(),
    actorId: text("actor_id").references(() => user.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => project.id, {
      onDelete: "set null",
    }),
    taskId: uuid("task_id").references(() => task.id, {
      onDelete: "set null",
    }),
    eventType: eventTypeEnum("event_Type"),
    createdAt: timestamp("created_at", defaultTimestampConfig)
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // Indexes
    index("public_notification_actorId_idx").on(t.actorId),
    index("public_notification_projectId_idx").on(t.projectId),
    index("public_notification_taskId_idx").on(t.taskId),
  ],
);

export type NotificationType = typeof notification.$inferSelect;
export type InsertNotificationType = typeof notification.$inferInsert;
export const notificationSchema = createSelectSchema(notification);
export const insertNotificationSchema = createInsertSchema(notification);

export const notificationRelations = relations(notification, ({ one }) => ({
  task: one(task, {
    fields: [notification.taskId],
    references: [task.id],
  }),
  project: one(project, {
    fields: [notification.projectId],
    references: [project.id],
  }),
  actor: one(user, {
    fields: [notification.actorId],
    references: [user.id],
  }),
}));

export const notificationReceive = pgTable(
  "notification_receive",
  {
    notificationId: uuid("notification_id").references(() => notification.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at", defaultTimestampConfig)
      .notNull()
      .defaultNow(),
    readAt: timestamp("read_at", defaultTimestampConfig),
  },
  (t) => [
    primaryKey({
      columns: [t.notificationId, t.userId],
      name: "public_notificationReceive_cpk",
    }),
    index("public_notificationReceive_notificationId_idx").on(t.notificationId),
    index("public_notificationReceive_userId_idx").on(t.userId),
  ],
);

export type NotificationReceiveType = typeof notificationReceive.$inferSelect;
export type InsertNotificationReceiveType =
  typeof notificationReceive.$inferInsert;
export const notificationReceiveSchema =
  createSelectSchema(notificationReceive);
export const insertNotificationReceiveSchema =
  createInsertSchema(notificationReceive);
export const updateNotificationReceiveSchema =
  createUpdateSchema(notificationReceive);

export const notificationReceiveRelations = relations(
  notificationReceive,
  ({ one }) => ({
    notification: one(notification, {
      fields: [notificationReceive.notificationId],
      references: [notification.id],
    }),
    user: one(user, {
      fields: [notificationReceive.userId],
      references: [user.id],
    }),
  }),
);
