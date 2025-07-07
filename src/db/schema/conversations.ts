import {
  date,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { messages } from "./messages";
import { teams } from "./teams";

// Conversation Table
export const conversations = pgTable(
  "conversations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    teamId: text("teamId")
      .references(() => teams.id, { onDelete: "cascade" })
      .unique(),
    type: text("type", {
      enum: ["team", "direct"],
    }).notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt", TIMESTAMP_CONFIGS).defaultNow(),
    updatedAt: timestamp("updatedAt", TIMESTAMP_CONFIGS).$onUpdateFn(
      () => new Date()
    ),
  },
  (t) => [
    index("CONVERSATIONS_NAME_IDX").on(t.name),
    index("CONVERSATIONS_TYPE_IDX").on(t.type),
  ]
);

// Relations For Conversations
export const conversationsRelations = relations(
  conversations,
  ({ many, one }) => ({
    // Relation with messages
    messages: many(messages, {
      relationName: "conversations_messages",
    }),

    // Relation With User
    conversationParticipants: many(conversationParticipants),

    // Relation With Team
    team: one(teams, {
      fields: [conversations.teamId],
      references: [teams.id],
    }),
  })
);

// Conversation Participants Join Table
export const conversationParticipants = pgTable(
  "conversationParticipants",
  {
    conversationId: text("conversationId")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role", {
      enum: ["owner", "admin", "assignee"],
    }),
    joinAt: timestamp("joinAt", TIMESTAMP_CONFIGS).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "CONVERSATIONS_PARTICIPANTS_PRIMARY_KEYS",
      columns: [t.conversationId, t.userId],
    }),
    index("CONVERSATIONS_PARTICIPANTS_CONVERSATIONS_ID_IDX").on(
      t.conversationId
    ),
    index("CONVERSATIONS_PARTICIPANTS_USER_ID_IDX").on(t.userId),
  ]
);

// Join Table Relations
export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    // User
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),

    // Conversation
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
  })
);

// Types
export type ConversationType = InferSelectModel<typeof conversations>;
export type ConvesationsInsertType = InferInsertModel<typeof conversations>;

export type ConversationMembershipType = InferSelectModel<
  typeof conversationParticipants
>;
export type ConversationMembershipInsertType = InferInsertModel<
  typeof conversationParticipants
>;
