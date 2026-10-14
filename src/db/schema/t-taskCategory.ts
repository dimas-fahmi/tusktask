import { sql } from "drizzle-orm";
import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { appSchema, TIMESTAMPZ_CONFIG } from "./module";
import { project } from "./t-project";

export const taskCategory = appSchema.table(
  "task_category",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    name: text("name").notNull().default("untitled"),
    projectId: uuid("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .notNull(),

    lastTaskOrderKey: text("last_task_order_key"), // Last order key generated for task

    projectOrderKey: text("project_order_key"), // This category order key in project

    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG)
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // FTS
    index("fts_app_taskCategory_name").using(
      "gin",
      sql`to_tsvector('simple', ${t.name})`,
    ),

    // IDX
    index("idx_app_taskCategory_projectId").on(t.projectId),
  ],
);

export type TaskCategoryInsertType = typeof taskCategory.$inferInsert;
