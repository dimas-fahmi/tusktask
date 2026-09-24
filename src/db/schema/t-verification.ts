import { sql } from "drizzle-orm";
import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authSchema, TIMESTAMPZ_CONFIG } from "./module";

export const verification = authSchema.table(
  "verification",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", TIMESTAMPZ_CONFIG).notNull(),
    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG).notNull(),
    updatedAt: timestamp("updated_at", TIMESTAMPZ_CONFIG)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    // IDX
    index("idx_auth_verification_identifier").on(t.identifier),
  ],
);
