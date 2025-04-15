import NextAuth from "next-auth";
import { db } from "./src/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts } from "./src/db/schema/accounts";
import { users } from "./src/db/schema/users";
import { sessions } from "./src/db/schema/sessions";
import { verificationTokens } from "./src/db/schema/verifications";
import { authenticators } from "./src/db/schema/authenticators";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  providers: [Google],
  callbacks: {
    async signIn({}) {
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
});
