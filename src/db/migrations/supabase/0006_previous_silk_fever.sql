ALTER TABLE "app_auth"."user" ADD COLUMN "deleted_at" timestamp (6) with time zone;--> statement-breakpoint
CREATE INDEX "appAuth_user_deletedAt_idx" ON "app_auth"."user" USING btree ("deleted_at");