import { sql } from "drizzle-orm";
import { index, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { appSchema, pointSourceEnum, TIMESTAMPZ_CONFIG } from "./module";
import { user } from "./t-user";

export const pointHistory = appSchema.table(
  "point_history",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).notNull().primaryKey(),
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    source: pointSourceEnum("source").notNull(),
    pointsBefore: integer("points_before").notNull(),
    pointsDelta: integer("points_delta").notNull(),
    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG)
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // IDX
    index("idx_app_pointHistory_userId").on(t.userId),
    index("idx_app_pointHistory_createdAt").on(t.createdAt),
  ],
);
