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
import type { NotificationPayload } from "@/src/lib/app/app";
import { user } from "./auth-schema";
import { defaultTimestampConfig } from "./configs";

export const notification = pgTable("notification", {
  id: uuid("id").primaryKey(),
  payload: jsonb("payload").$type<NotificationPayload>().notNull(),
  createdAt: timestamp("created_at", defaultTimestampConfig)
    .notNull()
    .defaultNow(),
});

export const notificationReceiver = pgTable(
  "notification_receiver",
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
      name: "public_notificationReceiver_cpk",
    }),
    index("public_notificationReceiver_notificationId_idx").on(
      t.notificationId,
    ),
    index("public_notificationReceiver_userId_idx").on(t.userId),
  ],
);

export const notificationReceiverRelations = relations(
  notificationReceiver,
  ({ one }) => ({
    notification: one(notification, {
      fields: [notificationReceiver.notificationId],
      references: [notification.id],
    }),
    user: one(user, {
      fields: [notificationReceiver.userId],
      references: [user.id],
    }),
  }),
);
