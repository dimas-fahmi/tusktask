import { sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  json,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { appSchema, TIMESTAMPZ_CONFIG } from "./module";
import { project } from "./t-project";
import { taskCategory } from "./t-taskCategory";
import { user } from "./t-user";

export const task = appSchema.table(
  "task",
  {
    // METADATA
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    name: text("name").notNull().default("untitled"),
    description: text("description"),

    // NESTED TASKS MECHANISM
    parentId: uuid("parent_id"),

    // OWNERSHIPS
    userId: uuid("user_id")
      .references(() => user.id, {
        onDelete: "cascade",
      })
      .notNull(),
    projectId: uuid("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),
    taskCategoryId: uuid("category_id").references(() => taskCategory.id, {
      onDelete: "cascade",
    }),

    // ORDERS
    projectOrderKey: text("project_order_key"),
    taskCategoryOrderKey: text("task_category_order_key"),

    // RECURRENCE MECHANISM
    rrule: text("rrule"),
    recurrenceStart: timestamp("recurrence_start", TIMESTAMPZ_CONFIG),
    nextOccurrence: timestamp("next_occurrence", TIMESTAMPZ_CONFIG),
    completionCount: smallint("completion_count").notNull().default(0),
    missDates: json("miss_dates").$type<Date[]>().notNull().default([]),

    // FUNCTIONALITY
    reminderAt: timestamp("reminder_at", TIMESTAMPZ_CONFIG),
    startAt: timestamp("start_at", TIMESTAMPZ_CONFIG),
    deadlineAt: timestamp("deadline_at", TIMESTAMPZ_CONFIG),
    archivedAt: timestamp("archived_at", TIMESTAMPZ_CONFIG),
    completedAt: timestamp("completed_at", TIMESTAMPZ_CONFIG),

    // TIMESTAMPS
    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG)
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // SFK
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "sfk_app_task_parentId",
    }).onDelete("cascade"),

    // FTS
    index("fts_app_task_name").using(
      "gin",
      sql`to_tsvector('english', ${t.name})`,
    ),

    // IDX
    index("idx_app_task_taskCategoryOrderKey").on(t.taskCategoryOrderKey),
    index("idx_app_task_projectOrderKey").on(t.projectOrderKey),
    index("idx_app_task_taskCategoryId").on(t.taskCategoryId),
    index("idx_app_task_parentId").on(t.parentId),
    index("idx_app_task_userId").on(t.userId),
    index("idx_app_task_projectId").on(t.projectId),
    index("idx_app_task_reminderAt").on(t.reminderAt),
    index("idx_app_task_startAt").on(t.startAt),
    index("idx_app_task_deadlineAt").on(t.deadlineAt),
    index("idx_app_task_archivedAt").on(t.archivedAt),
    index("idx_app_task_completedAt").on(t.completedAt),
    index("idx_app_task_createdAt").on(t.createdAt),
  ],
);
