import { sql } from "drizzle-orm";
import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authSchema, TIMESTAMPZ_CONFIG } from "./module";
import { user } from "./t-user";

export const session = authSchema.table(
  "session",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    expiresAt: timestamp("expires_at", TIMESTAMPZ_CONFIG).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG).notNull(),
    updatedAt: timestamp("updated_at", TIMESTAMPZ_CONFIG)
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [
    // IDX
    index("idx_auth_session_userId").on(t.userId),
  ],
);
