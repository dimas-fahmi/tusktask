import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { mediaSchema, TIMESTAMPZ_CONFIG } from "./module";
import { user } from "./t-user";

export const image = mediaSchema.table(
  "image",
  {
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    name: text("name").default("untitled").notNull(),
    description: text("description"),

    src: text("src").unique(),
    constructedSrc: text("constructed_src").unique().notNull(),

    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict",
      }),

    format: text("format").notNull(),
    size: integer("size").notNull(),
    isLocalDevelopment: boolean("is_local_development")
      .notNull()
      .default(false),

    // TIMESTAMPS
    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG)
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", TIMESTAMPZ_CONFIG),
  },
  (t) => [
    // UIDX
    uniqueIndex("uidx_media_image_src").on(t.src),

    // IDX
    index("idx_media_image_userId").on(t.userId),
    index("idx_media_image_format").on(t.format),
    index("idx_media_image_isLocalDevelopment").on(t.isLocalDevelopment),
    index("idx_media_image_deletedAt").on(t.userId),
  ],
);
