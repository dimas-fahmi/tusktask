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

// DISCORD
const discordId = process.env.DISCORD_CLIENT_ID;
const discordSecret = process.env.DISCORD_CLIENT_SECRET;

if (!discordId || !discordSecret) {
  throw new Error("DISCORD_ID_OR_SECRET_UNAVAILABLE");
}

// GOOGLE
const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleId || !googleSecret) {
  throw new Error("GOOGLE_ID_OR_SECRET_UNAVAILABLE");
}

// FACEBOOK
const facebookId = process.env.FACEBOOK_CLIENT_ID;
const facebookSecret = process.env.FACEBOOK_CLIENT_SECRET;

if (!facebookId || !facebookSecret) {
  throw new Error("FACEBOOK_ID_OR_SECRET_UNAVAILABLE");
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
    discord: {
      clientId: discordId,
      clientSecret: discordSecret,
    },
    github: {
      clientId: githubId,
      clientSecret: githubSecret,
    },
    google: {
      clientId: googleId,
      clientSecret: googleSecret,
    },
    facebook: {
      clientId: facebookId,
      clientSecret: facebookSecret,
    },
  },
});
