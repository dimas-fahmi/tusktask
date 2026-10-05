import { sql } from "drizzle-orm";
import { boolean, index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { appSchema, TIMESTAMPZ_CONFIG } from "./module";
import { user } from "./t-user";

export const project = appSchema.table(
  "project",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    name: text("name").notNull().default("untitle"),
    description: text("description"),

    isPrimary: boolean("is_primary").notNull().default(false),
    iconId: text("icon_id"),

    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    viewLayout: text("view_layout"),

    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG)
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // FTS
    index("fts_app_project_name").using(
      "gin",
      sql`to_tsvector('simple', ${t.name})`,
    ),

    // IDX
    index("idx_app_project_userId").on(t.userId),
  ],
);

export type ProjectSelectType = typeof project.$inferSelect;
