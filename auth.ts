import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./src/db";
import { users } from "./src/db/schema/users";
import { sessions } from "./src/db/schema/sessions";
import { accounts } from "./src/db/schema/accounts";
import { authenticators } from "./src/db/schema/authenticators";
import { verificationTokens } from "./src/db/schema/verificationTokens";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    sessionsTable: sessions,
    accountsTable: accounts,
    authenticatorsTable: authenticators,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google, GitHub, Discord],
  callbacks: {
    session: async ({ session, trigger }) => {
      if (trigger === "update") {
        const [newSession] = await db
          .select()
          .from(users)
          .where(eq(users.id, session.user.id));

        // @ts-ignore
        session.user = newSession;
      }
      return session;
    },
  },
});
