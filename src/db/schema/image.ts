import { relations, sql } from "drizzle-orm";
import {
  index,
  jsonb,
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
import {
  defaultTimestampConfig,
  mediaOwnershipEnum,
  mediaStorageEnum,
} from "./configs";

export const image = pgTable(
  "image",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url"),
    ownerId: text("owner_id").references(() => user.id, {
      onDelete: "set null",
    }),
    ownership: mediaOwnershipEnum("ownership").default("user_owned").notNull(),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    mediaStorage: mediaStorageEnum("media_storage").notNull(),
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
    index("public_image_tags_idx").using("gin", t.tags),
    index("public_image_ownerId_idx").on(t.ownerId),
    index("public_image_deletedAt_idx").on(t.deletedAt),
  ],
);

export type ImageType = typeof image.$inferSelect;
export type InsertImageType = typeof image.$inferInsert;

export const ImageSchema = createSelectSchema(image);
export const InsertImageSchema = createInsertSchema(image);
export const UpdateImageSchema = createUpdateSchema(image);

export const imageRelations = relations(image, ({ one }) => ({
  owner: one(user, {
    fields: [image.ownerId],
    references: [user.id],
  }),
}));
