import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

// Notifications Table
export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    body: text("text").notNull(),
    type: text("type", {
      enum: ["message", "friend_request", "sharing", "announcement"],
    }),
    senderId: text("sender_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    recipientId: text("recipient_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", {
      mode: "date",
      precision: 3,
      withTimezone: true,
    }).defaultNow(),
    markReadAt: timestamp("mark_read_at", {
      mode: "date",
      precision: 3,
      withTimezone: true,
    }),
  },
  (t) => [
    index("notifications_sender_id_idx").on(t.senderId),
    index("notifications_recipient_id_idx").on(t.recipientId),
  ]
);

// Notifications Relations
export const notificationsRelations = relations(notifications, ({ many }) => ({
  notificationsToUsers: many(notificationsToUsers),
}));

// Notifications Join Table
export const notificationsToUsers = pgTable(
  "notificationsToUsers",
  {
    notificationId: text("notification_id")
      .references(() => notifications.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.notificationId, t.userId] })]
);

// NotificationsToUsers Joint Table Relations
export const notificationsToUsersRelations = relations(
  notificationsToUsers,
  ({ one }) => ({
    notification: one(notifications, {
      fields: [notificationsToUsers.notificationId],
      references: [notifications.id],
    }),
    user: one(users, {
      fields: [notificationsToUsers.userId],
      references: [users.id],
    }),
  })
);
