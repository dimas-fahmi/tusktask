import { sql } from "drizzle-orm";
import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authSchema, TIMESTAMPZ_CONFIG } from "./module";
import { user } from "./t-user";

export const account = authSchema.table(
  "account",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp(
      "access_token_expires_at",
      TIMESTAMPZ_CONFIG,
    ),
    refreshTokenExpiresAt: timestamp(
      "refresh_token_expires_at",
      TIMESTAMPZ_CONFIG,
    ),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG).notNull(),
    updatedAt: timestamp("updated_at", TIMESTAMPZ_CONFIG)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    // IDX
    index("idx_auth_account_userId").on(t.userId),
  ],
);
