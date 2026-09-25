import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor } from "better-auth/plugins";
import { COLOR_THEME_IDS, DEFAULT_COLOR_THEME_ID } from "../app/colorTheme";
import { getEnv } from "../app/env";
import {
  DEFAULT_REGISTRATION_STEP,
  REGISTRATION_STEPS,
} from "../app/registrationPhase";
import { nidb } from "../db";
import { schema } from "../db/schema";
import { generateUsername } from "../utils/generateUsername";

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
    schema: {
      ...schema,
    },
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

  // USER MODEL
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: false,
        unique: true,
        defaultValue: generateUsername(),
        fieldName: "username",
      },

      colorThemeId: {
        type: [...COLOR_THEME_IDS],
        required: true,
        input: false,
        unique: false,
        defaultValue: DEFAULT_COLOR_THEME_ID,
        fieldName: "colorThemeId",
      },

      registrationStep: {
        type: [...REGISTRATION_STEPS],
        required: true,
        input: false,
        unique: false,
        defaultValue: DEFAULT_REGISTRATION_STEP,
        fieldName: "registrationStep",
      },

      soundNotification: {
        type: "boolean",
        required: true,
        input: false,
        unique: false,
        defaultValue: true,
        fieldName: "soundNotification",
      },

      soundEffect: {
        type: "boolean",
        required: true,
        input: false,
        unique: false,
        defaultValue: true,
        fieldName: "soundEffect",
      },

      attribution: {
        type: "string",
        required: false,
        input: false,
        unique: false,
        fieldName: "attribution",
      },

      deletedAt: {
        type: "date",
        required: false,
        input: false,
        unique: false,
        fieldName: "deletedAt",
      },
    },
  },
});

export type Auth = typeof auth;
export type SessionObject = typeof auth.$Infer.Session;
export type Session = SessionObject["session"];
export type User = SessionObject["user"];
