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
import { relations } from "drizzle-orm";
import { tasks } from "./tasks";

// Projects table
export const projects = pgTable(
  "projects",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    createdById: text("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ownerId: text("owner_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    estimatedHours: integer("estimated_hours"),
    estimatedMinutes: integer("estimated_minutes"),

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
    deadlineAt: timestamp("deadline_at", {
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
    index("projects_created_by_idx").on(t.createdById),
    index("projects_owner_id_idx").on(t.ownerId),
    index("projects_status_idx").on(t.status),
    index("projects_visibility_idx").on(t.visibility),
    index("projects_created_at_idx").on(t.createdAt),
    index("projects_deadline_at_idx").on(t.deadlineAt),
  ]
);

// Projects Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
  projectsToUsers: many(projectsToUsers),
}));

// Projects To Users Joint Table
export const projectsToUsers = pgTable(
  "projectsToUsers",
  {
    projectId: text("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [
    primaryKey({
      columns: [t.projectId, t.userId],
    }),
    unique("projects_to_users_unique_idx").on(t.projectId, t.userId),
  ]
);

// Projects To Users Joint Table Relations
export const projectsToUsersRelations = relations(
  projectsToUsers,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectsToUsers.projectId],
      references: [projects.id],
    }),
    user: one(users, {
      fields: [projectsToUsers.userId],
      references: [users.id],
    }),
  })
);
