import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { tasks } from "./tasks";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

// TEAMS TABLE
export const teams = pgTable(
  "teams",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    createdById: text("createdById").references(() => users.id, {
      onDelete: "set null",
    }),
    budget: integer("budget"),
    ownerId: text("ownerId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    type: text("type", { enum: ["private", "co-op", "primary"] }).default(
      "private"
    ),
    createdAt: timestamp("createdAt", TIMESTAMP_CONFIGS).defaultNow(),
    updatedAt: timestamp("updatedAt", TIMESTAMP_CONFIGS).$onUpdateFn(
      () => new Date()
    ),
    deletedAt: timestamp("deletedAt", TIMESTAMP_CONFIGS),
  },
  (t) => [
    index("TEAMS_CREATED_BY_IDX").on(t.createdById),
    index("TEAMS_OWNER_IDX").on(t.ownerId),
  ]
);

// RELATIONS : teams table
export const teamsRelations = relations(teams, ({ many, one }) => ({
  teamMembers: many(teamMembers),
  tasks: many(tasks),
  creator: one(users, {
    fields: [teams.createdById],
    references: [users.id],
  }),
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
}));

// TEAMS MEMBERS TABLE : (many-to-many relationship -> users & teams)
export const teamMembers = pgTable(
  "teamMembers",
  {
    teamId: text("teamId")
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(), // delete all records if team is deleted
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    userRole: text("userRole", {
      enum: ["owner", "admin", "assignee"],
    })
      .default("assignee")
      .notNull(),
    joinAt: timestamp("joinAt", TIMESTAMP_CONFIGS).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "TEAM_MEMBERS_PRIMARY_KEYS",
      columns: [t.teamId, t.userId],
    }),
    index("TEAM_MEMBERS_USER_ID_IDX").on(t.userId),
    index("TEAM_MEMBERS_TEAM_ID_IDX").on(t.teamId),
  ]
);

// RELATIONS: teamMembers
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export type TeamType = InferSelectModel<typeof teams>;
export type TeamInsertType = InferInsertModel<typeof teams>;
export type TeamMembersType = InferSelectModel<typeof teamMembers>;
export type TeamMembersInsertType = InferInsertModel<typeof teamMembers>;

export const teamSchema = createInsertSchema(teams);
export const teamMembersSchema = createInsertSchema(teamMembers);
export const teamMembersUpdateSchema = createUpdateSchema(teamMembers);
