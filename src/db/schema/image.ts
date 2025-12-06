import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { defaultTimestampConfig } from "./configs";

export const image = pgTable(
  "image",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url"),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", defaultTimestampConfig)
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", defaultTimestampConfig),
  },
  (t) => [
    // FTS
    index("public_image_name_fts").using(
      "gin",
      sql`to_tsvector('english', ${t.name})`,
    ),

    // Indexes
    index("public_image_ownerId_idx").on(t.ownerId),
    index("public_image_deletedAt_idx").on(t.deletedAt),
  ],
);

export const imageRelations = relations(image, ({ one }) => ({
  owner: one(user, {
    fields: [image.ownerId],
    references: [user.id],
  }),
}));
