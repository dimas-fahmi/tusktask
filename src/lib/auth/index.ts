import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/src/db";
import schema from "@/src/db/schema";

// GITHUB
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;

if (!githubId || !githubSecret) {
  throw new Error("GITHUB_ID_OR_SECRET_UNAVAILABLE");
}

export const auth = betterAuth({
  // DATABASE CONFIGURATION
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),

  // AUTH SETUP
  socialProviders: {
    github: {
      clientId: githubId,
      clientKey: githubSecret,
    },
  },
});
