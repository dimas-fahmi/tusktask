import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { projects } from "./projects";
import { createInsertSchema } from "drizzle-zod";

// Tasks Table
export const tasks = pgTable(
  "tasks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    createdById: text("created_by_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    ownerId: text("owner_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    completedById: text("completed_by_id").references(() => users.id, {
      onDelete: "set null",
    }),

    tags: text("tags").array(),

    estimatedHours: integer("estimated_hours"),
    estimatedMinutes: integer("estimated_minutes"),

    parentId: text("parent_id"),
    projectId: text("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),

    type: text("type", { enum: ["task", "event"] })
      .default("task")
      .notNull(),

    status: text("status", {
      enum: ["not_started", "in_progress", "completed", "archived"],
    })
      .default("not_started")
      .notNull(),
    visibility: text("visibility", {
      enum: ["private", "public", "shared"],
    })
      .default("private")
      .notNull(),

    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    startAt: timestamp("start_at", {
      mode: "date",
      withTimezone: true,
    }),
    reminderAt: timestamp("reminder_at", { mode: "date", withTimezone: true }),
    deadlineAt: timestamp("dealine_at", {
      mode: "date",
      withTimezone: true,
    }),
    completedAt: timestamp("completed_at", {
      mode: "date",
      withTimezone: true,
    }),
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  (t) => [
    index("tasks_created_by_idx").on(t.createdById),
    index("tasks_owner_id_idx").on(t.ownerId),
    index("tasks_completed_by_idx").on(t.completedById),
    index("tasks_status_idx").on(t.status),
    index("tasks_visibility_idx").on(t.visibility),
    index("tasks_created_at_idx").on(t.createdAt),
    index("tasks_deadline_at_idx").on(t.deadlineAt),
  ]
);

// Tasks Relations
export const tasksRelations = relations(tasks, ({ many }) => ({
  tasksToUsers: many(tasksToUsers),
}));

// Tasks To Users Joint Table
export const tasksToUsers = pgTable(
  "tasksToUsers",
  {
    taskId: text("task_id")
      .references(() => tasks.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.taskId, t.userId] }),
    unique("tasks_to_users_unique_idx").on(t.taskId, t.userId),
  ]
);

// Tasks To Users Joint Table Relations
export const tasksToUsersRelations = relations(tasksToUsers, ({ one }) => ({
  task: one(tasks, {
    fields: [tasksToUsers.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [tasksToUsers.userId],
    references: [users.id],
  }),
}));

export type TaskType = InferSelectModel<typeof tasks>;
export type TaskInsertType = InferInsertModel<typeof tasks>;
export const tasksInsertSchema = createInsertSchema(tasks);
