import { foreignKey, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { relations } from "drizzle-orm";

// MESSAGES TABLE
export const messages = pgTable(
  "messages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    content: text("content").notNull(),
    senderId: text("senderId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    receiverId: text("receiverId")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("createdAt", TIMESTAMP_CONFIGS).defaultNow(),
    respondToId: text("respondToId"),
  },
  (t) => [
    foreignKey({
      name: "MESSAGES_RESPOND_TO_ID_FK",
      columns: [t.respondToId],
      foreignColumns: [t.id],
    }).onDelete("cascade"),
  ]
);

// RELATIONS : messages
export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "messages_sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "messages_receiver",
  }),
  respondTo: one(messages, {
    fields: [messages.respondToId],
    references: [messages.id],
  }),
}));
