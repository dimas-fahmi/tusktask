import {
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { teams } from "./teams";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const tasks = pgTable(
  "tasks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    path: text("path").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    createdById: text("createdById").references(() => users.id, {
      onDelete: "set null",
    }),
    ownerId: text("ownerId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    teamId: text("teamId")
      .references(() => teams.id)
      .notNull(),
    parentId: text("parentId"),
    type: text("type", { enum: ["task", "shopping_list"] })
      .default("task")
      .notNull(),
    price: integer("price"),
    budget: integer("budget"),
    expenses: integer("expenses"),
    createdAt: timestamp("createdAt", TIMESTAMP_CONFIGS).defaultNow(),
    updatedAt: timestamp("updatedAt", TIMESTAMP_CONFIGS).$onUpdateFn(
      () => new Date()
    ),
    status: text("status", {
      enum: ["not_started", "on_process", "completed", "archived"],
    })
      .default("not_started")
      .notNull(),
    claimedById: text("claimedById").references(() => users.id, {
      onDelete: "set null",
    }),
    completedById: text("completedById").references(() => users.id, {
      onDelete: "set null",
    }),
    startAt: timestamp("startAt", TIMESTAMP_CONFIGS).defaultNow(),
    deadlineAt: timestamp("deadlineAt", TIMESTAMP_CONFIGS),
    completedAt: timestamp("completedAt", TIMESTAMP_CONFIGS),
  },
  (t) => [
    index("TASKS_CREATED_BY_IDX").on(t.createdById),
    index("TASKS_OWNER_ID_IDX").on(t.ownerId),
    index("TASKS_TEAM_ID_IDX").on(t.teamId),
    index("TASKS_PARENT_ID_IDX").on(t.parentId),
    index("TASKS_CLAIMED_BY_IDX").on(t.claimedById),
    index("TASKS_COMPLETED_BY_IDX").on(t.completedById),
    foreignKey({
      name: "TASKS_PARENT_FK",
      columns: [t.parentId],
      foreignColumns: [t.id],
    }).onDelete("cascade"),
  ]
);

// RELATIONS : tasks
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  team: one(teams, {
    fields: [tasks.teamId],
    references: [teams.id],
  }),
  parent: one(tasks, {
    fields: [tasks.parentId],
    references: [tasks.id],
    relationName: "task_subtasks",
  }),
  subtasks: many(tasks, {
    relationName: "task_subtasks",
  }),
  creator: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "task_creator",
  }),
  owner: one(users, {
    fields: [tasks.ownerId],
    references: [users.id],
    relationName: "task_owner",
  }),
  completedBy: one(users, {
    fields: [tasks.completedById],
    references: [users.id],
    relationName: "task_completedBy",
  }),
  claimedBy: one(users, {
    fields: [tasks.claimedById],
    references: [users.id],
    relationName: "task_claimedBy",
  }),
}));

export type TaskType = InferSelectModel<typeof tasks>;
export type TaskInsertType = InferInsertModel<typeof tasks>;

export const taskInsertSchema = createInsertSchema(tasks);
