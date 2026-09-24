import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authSchema, TIMESTAMPZ_CONFIG } from "./module";
import { user } from "./t-user";

export const twoFactor = authSchema.table(
  "two_factor",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: boolean("verified").default(true),
    failedVerificationCount: integer("failed_verification_count").default(0),
    lockedUntil: timestamp("locked_until", TIMESTAMPZ_CONFIG),
  },
  (table) => [
    // IDX
    index("idx_auth_twoFactor_secret").on(table.secret),
    index("idx_auth_twoFactor_userId").on(table.userId),
  ],
);
