import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { defaultTimestampConfig, notificationTypeEnum } from "./configs";

export type NotificationPayload =
  | {
      type: "sender" | "receiver";
      id: string;
      name: string;
      image: string;
    }
  | { type: "project"; id: string; name: string }
  | { type: "task"; id: string; name: string }
  | { type: "system" };

export const notification = pgTable("notification", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: notificationTypeEnum("type").notNull(),
  payload: json("payload").$type<NotificationPayload[]>(),
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
  ({ one, many }) => ({
    notification: one(notification, {
      fields: [notificationReceiver.notificationId],
      references: [notification.id],
    }),
    many: many(user),
  }),
);
