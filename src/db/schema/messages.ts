import { foreignKey, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { teams } from "./teams";
import { conversations } from "./conversations";
import { createInsertSchema } from "drizzle-zod";

// MESSAGES TABLE
export const messages = pgTable(
  "messages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    content: text("content").notNull(),
    conversationId: text("conversationId")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    senderId: text("senderId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("createdAt", TIMESTAMP_CONFIGS).defaultNow().notNull(),
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
  respondTo: one(messages, {
    fields: [messages.respondToId],
    references: [messages.id],
  }),

  // Conversation Relation
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
    relationName: "conversations_messages",
  }),
}));

export type MessageType = InferSelectModel<typeof messages>;
export type MessageInsertType = InferInsertModel<typeof messages>;

export const messageInsertSchema = createInsertSchema(messages);
