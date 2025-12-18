import { relations, sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { user } from "./auth-schema";
import { defaultTimestampConfig, taskStatusEnum } from "./configs";
import { notification } from "./notification";
import { project } from "./project";

export const task = pgTable(
  "task",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    priority: integer("priority"),
    status: taskStatusEnum("status").default("pending").notNull(),

    // Ownership
    createdById: text("created_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    ownerId: text("owner_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    claimedById: text("claimed_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    completedById: text("completed_by_id").references(() => user.id, {
      onDelete: "set null",
    }),

    // Filter
    isPinned: boolean("is_pinned").notNull().default(false),
    isArchived: boolean("is_archived").notNull().default(false),

    // Functionality
    projectId: uuid("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
    parentId: uuid("parent_id"),
    startAt: timestamp("start_at", defaultTimestampConfig),
    endAt: timestamp("end_at", defaultTimestampConfig),
    completedAt: timestamp("completed_at", defaultTimestampConfig),

    // Timestamp
    createdAt: timestamp("created_at", defaultTimestampConfig)
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", defaultTimestampConfig),
    deletedAt: timestamp("deleted_at", defaultTimestampConfig),
  },
  (t) => [
    // Self ref
    foreignKey({
      name: "public_task_parentId_fk",
      columns: [t.parentId],
      foreignColumns: [t.id],
    }),

    // FTS
    index("public_task_name_fts").using(
      "gin",
      sql`to_tsvector('english', ${t.name})`,
    ),

    // Indexes
    index("public_task_priority_idx").on(t.priority),
    index("public_task_status_idx").on(t.status),
    index("public_task_createdById_idx").on(t.createdById),
    index("public_task_ownerId_idx").on(t.ownerId),
    index("public_task_claimedById_idx").on(t.claimedById),
    index("public_task_completedById_idx").on(t.completedById),
    index("public_task_isPinned_idx").on(t.isPinned),
    index("public_task_isArchived_idx").on(t.isArchived),
    index("public_task_projectId_idx").on(t.projectId),
    index("public_task_parentId_idx").on(t.parentId),
    index("public_task_startAt_idx").on(t.startAt),
    index("public_task_endAt_idx").on(t.endAt),
    index("public_task_completedAt_idx").on(t.completedAt),
    index("public_task_createdAt_idx").on(t.createdAt),
    index("public_task_updatedAt_idx").on(t.updatedAt),
    index("public_task_deletedAt_idx").on(t.deletedAt),
  ],
);

export type TaskType = typeof task.$inferSelect;
export type InsertTaskType = typeof task.$inferInsert;
export const taskSchema = createSelectSchema(task);
export const insertTaskSchema = createInsertSchema(task);
export const updateTaskSchema = createUpdateSchema(task);

export const taskRelations = relations(task, ({ one, many }) => ({
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
  parent: one(task, {
    fields: [task.parentId],
    references: [task.id],
    relationName: "nestedTask",
  }),
  children: many(task, {
    relationName: "nestedTask",
  }),
  createdBy: one(user, {
    fields: [task.createdById],
    references: [user.id],
  }),
  ownedBy: one(user, {
    fields: [task.ownerId],
    references: [user.id],
  }),
  claimedBy: one(user, {
    fields: [task.claimedById],
    references: [user.id],
  }),
  completedBy: one(user, {
    fields: [task.completedById],
    references: [user.id],
  }),
  notifications: many(notification),
}));
