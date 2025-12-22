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
    eventType: eventTypeEnum("event_type"),
    createdAt: timestamp("created_at", defaultTimestampConfig)
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", defaultTimestampConfig),
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

export const notificationReceipt = pgTable(
  "notification_receipt",
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
      name: "public_notificationReceipt_cpk",
    }),
    index("public_notificationReceipt_notificationId_idx").on(t.notificationId),
    index("public_notificationReceipt_userId_idx").on(t.userId),
  ],
);

export type NotificationReceiptType = typeof notificationReceipt.$inferSelect;
export type InsertNotificationReceiptType =
  typeof notificationReceipt.$inferInsert;
export const notificationReceiptSchema =
  createSelectSchema(notificationReceipt);
export const insertNotificationReceiptSchema =
  createInsertSchema(notificationReceipt);
export const updateNotificationReceiptSchema =
  createUpdateSchema(notificationReceipt);

export const notificationReceiptRelations = relations(
  notificationReceipt,
  ({ one }) => ({
    notification: one(notification, {
      fields: [notificationReceipt.notificationId],
      references: [notification.id],
    }),
    user: one(user, {
      fields: [notificationReceipt.userId],
      references: [user.id],
    }),
  }),
);
