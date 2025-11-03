import { relations, sql } from "drizzle-orm";
import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { mainSchema, projectStatusEnum, TIMESTAMP_CONFIG } from "./configs";
import { profiles } from "./profiles";
import { tasks } from "./tasks";

export const projects = mainSchema.table(
  "projects",
  {
    // Metadata
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),

    // Relations
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    // Functionality Field
    status: projectStatusEnum("status").notNull().default("active"),

    // Timestamps Metadata
    createdAt: timestamp("created_at", TIMESTAMP_CONFIG).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", TIMESTAMP_CONFIG).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", TIMESTAMP_CONFIG),
  },
  (t) => [
    // FTS for name
    index("FTS_MAIN_SCHEMA_PROJECTS_NAME").using(
      `gin`,
      sql`to_tsvector('english', ${t.name})`,
    ),

    // FTS for description
    index("FTS_MAIN_SCHEMA_PROJECTS_DESCRIPTION").using(
      `gin`,
      sql`to_tsvector('english', ${t.description})`,
    ),

    // Indexes
    index("IDX_MAIN_SCHEMA_PROJECTS_OWNER_ID").on(t.ownerId),
    index("IDX_MAIN_SCHEMA_PROJECTS_STATUS").on(t.status),
    index("IDX_MAIN_SCHEMA_PROJECTS_DELETED_AT").on(t.deletedAt),
  ],
);

// TYPES
export type SelectProject = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Zod Schema
export const projectSelectSchema = createSelectSchema(projects);
export const projectInsertSchema = createInsertSchema(projects);

// Projects Relations
export const projectsRelations = relations(projects, ({ many, one }) => ({
  // Owner
  owner: one(profiles, {
    fields: [projects.ownerId],
    references: [profiles.id],
    relationName: "RELATION_PROJECT_OWNER",
  }),

  // Tasks
  tasks: many(tasks, { relationName: "RELATION_PROJECT_TASKS" }),
}));
