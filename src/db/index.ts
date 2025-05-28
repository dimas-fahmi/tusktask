import { drizzle } from "drizzle-orm/neon-http";

import * as accounts from "./schema/accounts";
import * as authenticators from "./schema/authenticators";
import * as messages from "./schema/messages";
import * as notifications from "./schema/notifications";
import * as sessions from "./schema/sessions";
import * as tasks from "./schema/tasks";
import * as teams from "./schema/teams";
import * as users from "./schema/users";
import * as verificationTokens from "./schema/verificationTokens";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL doesn't exist");
}

const schema = {
  schema: {
    ...accounts,
    ...authenticators,
    ...messages,
    ...notifications,
    ...sessions,
    ...tasks,
    ...teams,
    ...users,
    ...verificationTokens,
  },
};

export const db = drizzle(process.env.DATABASE_URL, schema);
