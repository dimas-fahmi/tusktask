import generateRandomUsername from "@/src/lib/tusktask/generator/generateRandomUsername";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { boolean, timestamp, pgTable, text, index } from "drizzle-orm/pg-core";
import { createUpdateSchema } from "drizzle-zod";
import { teamMembers } from "./teams";
import { notifications } from "./notifications";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { tasks } from "./tasks";
import { messages } from "./messages";

// USERS TABLE
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    username: text("username")
      .$defaultFn(() => generateRandomUsername())
      .notNull()
      .unique(),
    notificationSoundEnable: boolean("notificationSoundEnable").default(true),
    reminderSoundEnable: boolean("reminderSoundEnable").default(true),
    email: text("email").unique(),
    timezone: text("timezone").default("Asia/Jakarta").notNull(),
    emailVerified: timestamp("emailVerified", TIMESTAMP_CONFIGS),
    registration: text("registration", {
      enum: ["username", "email", "avatar", "preferences", "complete"],
    })
      .default("username")
      .notNull(),
    theme: text("theme", { enum: ["default", "dark", "cassandra", "nebula"] })
      .default("default")
      .notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt", TIMESTAMP_CONFIGS).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", TIMESTAMP_CONFIGS).$onUpdateFn(
      () => new Date()
    ),
  },
  (t) => [index("USERS_NAME_IDX").on(t.name)]
);

// RELATIONS : users table
export const usersRelations = relations(users, ({ many }) => ({
  // Team Relations
  teamMembers: many(teamMembers),

  // Notifications Relations
  notifications: many(notifications),
  sentNotifications: many(notifications, {
    relationName: "notification_sender",
  }),
  receivedNotifications: many(notifications, {
    relationName: "notification_receiver",
  }),

  // Tasks Relations
  tasks: many(tasks),
  createdTasks: many(tasks, {
    relationName: "task_creator",
  }),
  ownedTasks: many(tasks, {
    relationName: "task_owner",
  }),
  completedTasks: many(tasks, {
    relationName: "task_completedBy",
  }),
  claimedTasks: many(tasks, {
    relationName: "task_claimedBy",
  }),

  // Messages Relations
  messages: many(messages),
  sendMessages: many(messages, {
    relationName: "messages_sender",
  }),
  receivedMessages: many(messages, {
    relationName: "messages_receiver",
  }),
}));

export type UserType = InferSelectModel<typeof users>;
export type UserInsertType = InferInsertModel<typeof users>;

export const UserUpdateSchema = createUpdateSchema(users);
