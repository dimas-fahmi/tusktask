import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";

// NOTIFICATIONS TABLE
export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title"),
    description: text("description"),
    type: text("type", {
      enum: ["notification", "message", "invitation"],
    })
      .default("notification")
      .notNull(),
    senderId: text("senderId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: text("receiverId")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("createdAt", TIMESTAMP_CONFIGS).defaultNow(),
    markReadAt: timestamp("markReadAt", TIMESTAMP_CONFIGS),
  },
  (t) => [
    index("NOTIFICATIONS_SENDER_IDX").on(t.senderId),
    index("NOTIFICATIONS_RECEIVER_IDX").on(t.receiverId),
    index("NOTIFICATIONS_TYPE_IDX").on(t.type),
  ]
);

// RELATIONS : notifications
export const notificationsRelations = relations(notifications, ({ one }) => ({
  sender: one(users, {
    fields: [notifications.senderId],
    references: [users.id],
    relationName: "notifications_sender",
  }),
  receiver: one(users, {
    fields: [notifications.receiverId],
    references: [users.id],
    relationName: "notification_receiver",
  }),
}));
