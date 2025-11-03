import { relations, sql } from "drizzle-orm";
import { foreignKey, index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { mainSchema, statusEnum, TIMESTAMP_CONFIG } from "./configs";
import { profiles } from "./profiles";
import { projects } from "./projects";

export const tasks = mainSchema.table(
  "tasks",
  {
    // Metadata
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),

    // Relations
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    parentId: uuid("parent_id"),
    ownerId: uuid("owner_id")
      .references(() => profiles.id, { onDelete: "cascade" })
      .notNull(),

    // Functionality Fields
    status: statusEnum("status").notNull().default("pending"),

    // Timestamps Functionality
    startAt: timestamp("start_at", TIMESTAMP_CONFIG).notNull().defaultNow(),
    reminderAt: timestamp("reminder_at", TIMESTAMP_CONFIG),
    finishAt: timestamp("finish_at", TIMESTAMP_CONFIG),

    // Timestamps Metadata
    createdAt: timestamp("created_at", TIMESTAMP_CONFIG).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", TIMESTAMP_CONFIG).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", TIMESTAMP_CONFIG),
  },
  (t) => [
    // Self-relation
    foreignKey({
      name: "FK_MAIN_SCHEMA_TASKS_PARENT_ID",
      columns: [t.parentId],
      foreignColumns: [t.id],
    }).onDelete("cascade"),

    // FTS
    index("FTS_MAIN_SCHEMA_TASKS_NAME").using(
      "gin",
      sql`to_tsvector('english', ${t.name})`,
    ),
    index("FTS_MAIN_SCHEMA_TASKS_DESCRIPTION").using(
      "gin",
      sql`to_tsvector('english', ${t.description})`,
    ),

    // Indexes
    index("IDX_MAIN_SCHEMA_TASKS_PROJECT_ID").on(t.projectId),
    index("IDX_MAIN_SCHEMA_TASKS_PARENT_ID").on(t.parentId),
    index("IDX_MAIN_SCHEMA_TASKS_OWNER_ID").on(t.ownerId),
    index("IDX_MAIN_SCHEMA_TASKS_STATUS").on(t.status),

    // Timestamp Indexes
    index("IDX_MAIN_SCHEMA_TASKS_START_AT").on(t.startAt),
    index("IDX_MAIN_SCHEMA_TASKS_REMINDER_AT").on(t.reminderAt),
    index("IDX_MAIN_SCHEMA_TASKS_FINISH_AT").on(t.finishAt),
    index("IDX_MAIN_SCHEMA_TASKS_CREATED_AT").on(t.createdAt),
    // skip updated at as we're unlikely going to query by that field
    index("IDX_MAIN_SCHEMA_TASKS_DELETED_AT").on(t.deletedAt),
  ],
);

// Types
export type SelectTask = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Zod Schema
export const taskSelectSchema = createSelectSchema(tasks);
export const taskInsertSchema = createInsertSchema(tasks);

// Tasks Relations
export const tasksRelations = relations(tasks, ({ one }) => ({
  // Owner
  owner: one(profiles, {
    fields: [tasks.ownerId],
    references: [profiles.id],
    relationName: "RELATION_TASK_OWNER",
  }),

  // Project
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
    relationName: "RELATION_TASK_PROJECT",
  }),
}));
