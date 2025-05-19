import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./src/db";
import { users } from "./src/db/schema/users";
import { sessions } from "./src/db/schema/sessions";
import { accounts } from "./src/db/schema/accounts";
import { authenticators } from "./src/db/schema/authenticators";
import { verificationTokens } from "./src/db/schema/verificationTokens";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    sessionsTable: sessions,
    accountsTable: accounts,
    authenticatorsTable: authenticators,
    verificationTokensTable: verificationTokens,
  }),
  providers: [],
});
