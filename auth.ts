import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./src/db";
import { registrationPhases, users } from "./src/db/schema/users";
import { sessions } from "./src/db/schema/sessions";
import { accounts } from "./src/db/schema/accounts";
import { authenticators } from "./src/db/schema/authenticators";
import { verificationTokens } from "./src/db/schema/verificationTokens";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import { eq } from "drizzle-orm";
import { teamMembers, teams } from "./src/db/schema/teams";

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
    session: async ({ session, trigger, newSession }) => {
      if (session.user.registration !== "complete") {
        const primaryTeam = await db.query.teamMembers.findMany({
          where: eq(teamMembers.userId, session.user.id),
        });

        if (primaryTeam.length === 0) {
          const newTeam = await db
            .insert(teams)
            .values({
              name: `${session.user.name}'s Team`,
              ownerId: session.user.id,
              createdById: session.user.id,
              type: "primary",
            })
            .returning();

          if (newTeam) {
            await db.insert(teamMembers).values({
              teamId: newTeam[0].id,
              userId: session.user.id,
              userRole: "owner",
              joinAt: new Date(),
            });
          }
        }
      }

      // Check if new session is exist
      if (newSession && newSession?.user) {
        // Check if registration phase is updated
        if (newSession?.user?.registration) {
          const newRegistrationPhase = newSession.user.registration;
          // Validate new registration phase
          if (registrationPhases.includes(newRegistrationPhase)) {
            console.log(`${newRegistrationPhase} is valid`);
            session.user.registration = newRegistrationPhase;
          }
        }
      }

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
