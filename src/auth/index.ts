import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor } from "better-auth/plugins";
import { getEnv } from "../app/env";
import { nidb } from "../db";

export const auth = betterAuth({
  // APP
  appName: "TuskTask",
  baseURL: getEnv("NEXT_PUBLIC_APP_URL"),

  // ADVANCED
  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  // DATABASE CONNECTION
  database: drizzleAdapter(nidb, {
    provider: "pg",
  }),

  // PLUGINS
  plugins: [
    // EMAIL OTP
    emailOTP({
      async sendVerificationOTP() {},
    }),

    // TWO FACTOR PLUGIN
    twoFactor(),
  ],

  // SESSION
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 1, // 1 minute
    },
  },

  // SOCIAL PROVIDERS
  socialProviders: {
    discord: {
      clientId: getEnv("DISCORD_OAUTH_ID"),
      clientSecret: getEnv("DISCORD_OAUTH_SECRET"),
    },

    github: {
      clientId: getEnv("GITHUB_OAUTH_ID"),
      clientSecret: getEnv("GITHUB_OAUTH_SECRET"),
    },

    google: {
      clientId: getEnv("GOOGLE_OAUTH_ID"),
      clientSecret: getEnv("GOOGLE_OAUTH_SECRET"),
    },
  },
});
