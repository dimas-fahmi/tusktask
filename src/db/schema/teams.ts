import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";

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
export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
}));

// TEAMS MEMBERS TABLE : (many-to-many relationship -> users & teams)
export const teamMembers = pgTable(
  "teamMembers",
  {
    teamId: text("teamId").references(() => teams.id, { onDelete: "cascade" }), // delete all records if team is deleted
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
    userRole: text("userRole", {
      enum: ["owner", "admin", "assignee"],
    }).default("assignee"),
    joinAt: timestamp("joinAt", TIMESTAMP_CONFIGS).defaultNow(),
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
