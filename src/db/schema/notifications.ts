import { index, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { teams } from "./teams";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

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
      enum: [
        "joinedATeam", // when someone joined a team, team members will be notified
        "directMessage",
        "groupChat",
        "teamInvitation", // team invitation
        "transferOwnership", // when owner want to transfer team ownership
        "adminRequest", // when someone request for administration role
        "taskClaim", // when someone claimed a task
        "taskCompletion", // when somone completed a task
        "broadcastTeamInvitation", // when owner or admin invite someone, members will be notified
        "assignNotification", // when someone request other user to claim a task
        "reminder", // reminder notification for tasks deadline
        "system", // system broadcast
      ],
    }).notNull(),
    category: text("category", {
      enum: ["tasks", "teams", "messages", "reminders", "generic"],
    })
      .default("generic")
      .notNull(),
    status: text("status", {
      enum: ["not_read", "acknowledged", "accepted", "rejected"],
    })
      .default("not_read")
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
    teamId: text("teamId").references(() => teams.id, { onDelete: "cascade" }),
    payload: json("payload").$type<Record<string, any>>(),
  },
  (t) => [
    index("NOTIFICATIONS_SENDER_IDX").on(t.senderId),
    index("NOTIFICATIONS_RECEIVER_IDX").on(t.receiverId),
    index("NOTIFICATIONS_TYPE_IDX").on(t.type),
    index("NOTIFICATIONS_STATUS_IDX").on(t.status),
    index("NOTIFICATIONS_CATEGORY_IDX").on(t.category),
    index("NOTIFICATIONS_TEAM_IDX").on(t.teamId),
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
  team: one(teams, {
    fields: [notifications.teamId],
    references: [teams.id],
    relationName: "notifications_team",
  }),
}));

export type NotificationType = InferSelectModel<typeof notifications>;
export type NotificationInsertType = InferInsertModel<typeof notifications>;

export const notificationSchema = createInsertSchema(notifications);
export const notificationUpdateSchema = createUpdateSchema(notifications);
