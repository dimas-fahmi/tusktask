import { relations, sql } from "drizzle-orm";
import { index, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TIMESTAMP_CONFIG, userSchema } from "./configs";
import { projects } from "./projects";
import { tasks } from "./tasks";

export const profiles = userSchema.table(
  "profiles",
  {
    id: uuid()
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    name: text("name"),
    username: text("username").unique(),
    avatar: text("avatar"),
    createdAt: timestamp("created_at", TIMESTAMP_CONFIG),
  },
  (t) => [
    // FTS
    index("FTS_USER_SCHEMA_PROFILES_NAME").using(
      `gin`,
      sql`to_tsvector('simple', ${t.name})`,
    ),

    // Indexes
    uniqueIndex("UIDX_USER_SCHEMA_PROFILES_USERNAME").on(t.username),
  ],
);

// Types
export type SelectProfile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

// Zod Schema
export const profileSelectSchema = createSelectSchema(profiles);
export const profileInsertSchema = createInsertSchema(profiles);

export const profilesRelations = relations(profiles, ({ many }) => ({
  // Projects
  projects: many(projects, { relationName: "RELATION_USER_PROJECTS" }),

  // Tasks
  tasks: many(tasks, { relationName: "RELATION_USER_TASKS" }),
}));
