import { timestamp, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", TIMESTAMP_CONFIGS).notNull(),
});
