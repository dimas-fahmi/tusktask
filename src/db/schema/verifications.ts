import { timestamp, pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { generateOTP } from "@/src/lib/tusktask/utils/generateOTP";

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const verificationDigits = pgTable("verificationDigits", {
  identifier: text("identifier")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  digits: text("digits")
    .$defaultFn(() => generateOTP())
    .notNull(),
  expiresAt: timestamp("expires_at")
    .$defaultFn(() => {
      const now = new Date();
      return new Date(now.getTime() + 10 * 60 * 1000);
    })
    .notNull(),
});
