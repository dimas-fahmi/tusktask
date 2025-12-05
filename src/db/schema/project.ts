import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import {
  defaultTimestampConfig,
  projectMembershipTypeEnum,
  projectTypeEnum,
} from "./configs";
import { task } from "./task";

export const project = pgTable(
  "project",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    type: projectTypeEnum("type"),

    // FILTER
    isPinned: boolean("is_pinned").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),

    // OWNERSHIPS
    createdById: text("created_by_id").references(() => user.id, {
      onDelete: "set null",
    }),
    ownerId: text("owner_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),

    // TIMESTAMPS
    createdAt: timestamp("created_at", defaultTimestampConfig)
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", defaultTimestampConfig),
    deletedAt: timestamp("deleted_at", defaultTimestampConfig),
  },
  (t) => [
    // FTS
    index("public_project_name_fts").using(
      "gin",
      sql`to_tsvector('english',${t.name})`,
    ),

    // Indexes
    index("public_project_type_idx").on(t.type),
    index("public_project_isPinned_idx").on(t.isPinned),
    index("public_project_isArchived_idx").on(t.isArchived),
    index("public_project_createdById_idx").on(t.createdById),
    index("public_project_ownerId_idx").on(t.ownerId),
    index("public_project_createdAt_idx").on(t.createdAt),
    index("public_project_updatedAt_idx").on(t.updatedAt),
    index("public_project_deletedAt_idx").on(t.deletedAt),
  ],
);

export const projectMembership = pgTable(
  "project_membership",
  {
    projectId: uuid("project_id").references(() => project.id, {
      onDelete: "cascade",
    }),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    type: projectMembershipTypeEnum("type").notNull(),
    createdAt: timestamp("created_at", defaultTimestampConfig)
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", defaultTimestampConfig).$onUpdate(
      () => new Date(),
    ),
    deletedAt: timestamp("deleted_at", defaultTimestampConfig),
  },
  (t) => [
    primaryKey({
      columns: [t.projectId, t.userId],
      name: "public_projectMembership_cpk",
    }),
  ],
);

export const projectRelations = relations(project, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [project.createdById],
    references: [user.id],
    relationName: "project_creator",
  }),
  owner: one(user, {
    fields: [project.ownerId],
    references: [user.id],
    relationName: "project_owner",
  }),
  tasks: many(task),
  memberships: many(projectMembership),
}));

export const projectMembershipRelations = relations(
  projectMembership,
  ({ one }) => ({
    project: one(project, {
      fields: [projectMembership.projectId],
      references: [project.id],
    }),
    member: one(user, {
      fields: [projectMembership.userId],
      references: [user.id],
    }),
  }),
);
