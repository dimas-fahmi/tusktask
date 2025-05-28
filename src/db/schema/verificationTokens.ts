import { TIMESTAMP_CONFIGS } from "@/src/lib/tusktask/constants/configs";
import { timestamp, pgTable, text, primaryKey } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", TIMESTAMP_CONFIGS).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);
