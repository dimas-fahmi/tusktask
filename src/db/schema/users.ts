import { generateRandomString } from "@/src/lib/tusktask/utils/generateRandomString";
import { InferSelectModel, relations } from "drizzle-orm";
import { timestamp, pgTable, text, unique } from "drizzle-orm/pg-core";
import { notificationsToUsers } from "./notifications";
import { tasksToUsers } from "./tasks";
import { projectsToUsers } from "./projects";

// Users Table
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    userName: text("user_name")
      .$defaultFn(() => `user_${generateRandomString()}`)
      .notNull(),
    birthDate: timestamp("birth_date", { mode: "date" }),
    email: text("email").unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }), // no "at" drizzle-adapter compatibility issue
    image: text("image"),
    theme: text("theme", { enum: ["default", "cassandra_pink"] })
      .default("default")
      .notNull(),
    registration: text("registration", {
      enum: [
        "birthDate",
        "personal",
        "username",
        "email",
        "avatar",
        "final",
        "done",
      ],
    })
      .default("birthDate")
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      precision: 3,
      withTimezone: true,
    }).$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", {
      mode: "date",
      precision: 3,
      withTimezone: true,
    }),
  },
  (t) => [unique("users_user_name_idx").on(t.userName)]
);

// Users Relations
export const usersRelations = relations(users, ({ many }) => ({
  notificationsToUsers: many(notificationsToUsers),
  tasksToUsers: many(tasksToUsers),
  projectsToUsers: many(projectsToUsers),
}));

// User Type
export type UserType = InferSelectModel<typeof users>;
