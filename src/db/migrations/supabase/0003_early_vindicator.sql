CREATE TYPE "public"."media_ownership_enum" AS ENUM('system', 'user_owned');--> statement-breakpoint
CREATE TYPE "public"."media_storage" AS ENUM('internal', 'external');--> statement-breakpoint
ALTER TABLE "app_auth"."user" ALTER COLUMN "theme" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app_auth"."user" ALTER COLUMN "theme" SET DEFAULT 'default'::text;--> statement-breakpoint
DROP TYPE "app_auth"."theme_enum";--> statement-breakpoint
CREATE TYPE "app_auth"."theme_enum" AS ENUM('default', 'dark', 'popBella', 'brownBear', 'coffeePuff', 'jetBlack');--> statement-breakpoint
ALTER TABLE "app_auth"."user" ALTER COLUMN "theme" SET DEFAULT 'default'::"app_auth"."theme_enum";--> statement-breakpoint
ALTER TABLE "app_auth"."user" ALTER COLUMN "theme" SET DATA TYPE "app_auth"."theme_enum" USING "theme"::"app_auth"."theme_enum";--> statement-breakpoint
ALTER TABLE "image" ADD COLUMN "ownership" "media_ownership_enum" DEFAULT 'user_owned';--> statement-breakpoint
ALTER TABLE "image" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "image" ADD COLUMN "media_storage" "media_storage" NOT NULL;--> statement-breakpoint
CREATE INDEX "public_image_tags_idx" ON "image" USING gin ("tags");