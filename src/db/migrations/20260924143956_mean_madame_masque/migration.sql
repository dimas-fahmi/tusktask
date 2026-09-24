CREATE SCHEMA "app";
--> statement-breakpoint
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "auth"."color_theme_enum" AS ENUM('default', 'dark');--> statement-breakpoint
CREATE TYPE "auth"."registration_step_enum" AS ENUM('attribution', 'name', 'username', 'avatar', 'confirmation', 'completed');--> statement-breakpoint
CREATE TABLE "auth"."account" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp(6) with time zone,
	"refresh_token_expires_at" timestamp(6) with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp(6) with time zone NOT NULL,
	"updated_at" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"expires_at" timestamp(6) with time zone NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp(6) with time zone NOT NULL,
	"updated_at" timestamp(6) with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."two_factor" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" uuid NOT NULL,
	"verified" boolean DEFAULT true,
	"failed_verification_count" integer DEFAULT 0,
	"locked_until" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "auth"."user" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"name" text NOT NULL,
	"username" text NOT NULL UNIQUE,
	"image" text,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"color_theme" "auth"."color_theme_enum" DEFAULT 'default'::"auth"."color_theme_enum" NOT NULL,
	"registration_step" "auth"."registration_step_enum" DEFAULT 'attribution'::"auth"."registration_step_enum" NOT NULL,
	"sound_notification" boolean DEFAULT true NOT NULL,
	"sound_effect" boolean DEFAULT true NOT NULL,
	"attribution" text,
	"created_at" timestamp(6) with time zone NOT NULL,
	"updated_at" timestamp(6) with time zone NOT NULL,
	"deleted_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "auth"."verification" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp(6) with time zone NOT NULL,
	"created_at" timestamp(6) with time zone NOT NULL,
	"updated_at" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_auth_account_userId" ON "auth"."account" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_auth_session_userId" ON "auth"."session" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_auth_twoFactor_secret" ON "auth"."two_factor" ("secret");--> statement-breakpoint
CREATE INDEX "idx_auth_twoFactor_userId" ON "auth"."two_factor" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uidx_auth_user_username" ON "auth"."user" ("username");--> statement-breakpoint
CREATE INDEX "idx_auth_user_attribution" ON "auth"."user" ("attribution");--> statement-breakpoint
CREATE INDEX "idx_auth_user_deletedAt" ON "auth"."user" ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_auth_verification_identifier" ON "auth"."verification" ("identifier");--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;