import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { DEFAULT_COLOR_THEME_ID } from "@/src/app/colorTheme";
import { DEFAULT_REGISTRATION_STEP } from "@/src/app/registrationPhase";
import { generateUsername } from "@/src/utils/generateUsername";
import {
  authSchema,
  colorThemeIdEnum,
  registrationStepEnum,
  TIMESTAMPZ_CONFIG,
} from "./module";

export const user = authSchema.table(
  "user",
  {
    // METADATA
    id: uuid("id").default(sql`pg_catalog.uuidv7()`).primaryKey(),
    name: text("name").notNull(),
    username: text("username")
      .unique()
      .notNull()
      .$defaultFn(() => generateUsername()),
    image: text("image"),

    // EMAIL
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),

    // CONFIGURATIONS
    twoFactorEnabled: boolean("two_factor_enabled").default(false),
    colorThemeId: colorThemeIdEnum("color_theme")
      .notNull()
      .default(DEFAULT_COLOR_THEME_ID),
    registrationStep: registrationStepEnum("registration_step")
      .notNull()
      .default(DEFAULT_REGISTRATION_STEP),
    soundNotification: boolean("sound_notification").notNull().default(true),
    soundEffect: boolean("sound_effect").notNull().default(true),

    // ATTRIBUTION
    attribution: text("attribution"),

    // TIMESTAMPS
    createdAt: timestamp("created_at", TIMESTAMPZ_CONFIG).notNull(),
    updatedAt: timestamp("updated_at", TIMESTAMPZ_CONFIG)
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at", TIMESTAMPZ_CONFIG),
  },
  (t) => [
    // UIDX
    uniqueIndex("uidx_auth_user_username").on(t.username),

    // IDX
    index("idx_auth_user_attribution").on(t.attribution),
    index("idx_auth_user_deletedAt").on(t.deletedAt),
  ],
);
