CREATE SCHEMA "app";
--> statement-breakpoint
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "media";
--> statement-breakpoint
CREATE TYPE "auth"."color_theme_enum" AS ENUM('default', 'dark');--> statement-breakpoint
CREATE TYPE "app"."point_source_enum" AS ENUM('task_completion', 'registration');--> statement-breakpoint
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
CREATE TABLE "media"."image" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"name" text DEFAULT 'untitled' NOT NULL,
	"description" text,
	"src" text UNIQUE,
	"constructed_src" text NOT NULL UNIQUE,
	"user_id" uuid NOT NULL,
	"format" text NOT NULL,
	"size" integer NOT NULL,
	"is_local_development" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "app"."point_history" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"user_id" uuid NOT NULL,
	"source" "app"."point_source_enum" NOT NULL,
	"points_before" integer NOT NULL,
	"points_delta" integer NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."project" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"name" text DEFAULT 'untitled' NOT NULL,
	"description" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"icon_id" text DEFAULT 'folder' NOT NULL,
	"user_id" uuid NOT NULL,
	"view_layout" text DEFAULT 'list' NOT NULL,
	"last_task_order_key" text,
	"last_category_order_key" text,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
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
CREATE TABLE "app"."task" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"name" text DEFAULT 'untitled' NOT NULL,
	"description" text,
	"parent_id" uuid,
	"user_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"category_id" uuid,
	"project_order_key" text,
	"task_category_order_key" text,
	"rrule" text,
	"recurrence_start" timestamp(6) with time zone,
	"next_occurrence" timestamp(6) with time zone,
	"completion_count" smallint DEFAULT 0 NOT NULL,
	"miss_dates" json DEFAULT '[]' NOT NULL,
	"reminder_at" timestamp(6) with time zone,
	"start_at" timestamp(6) with time zone,
	"deadline_at" timestamp(6) with time zone,
	"archived_at" timestamp(6) with time zone,
	"completed_at" timestamp(6) with time zone,
	"priority" smallint DEFAULT 50 NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "idx_app_task_priority_min_max" CHECK ("priority" BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE TABLE "app"."task_category" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"name" text DEFAULT 'untitled' NOT NULL,
	"project_id" uuid NOT NULL,
	"last_task_order_key" text,
	"project_order_key" text,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
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
	"points" integer DEFAULT 0 NOT NULL,
	"activity_streak" integer DEFAULT 0 NOT NULL,
	"last_point_reward_at" timestamp(6) with time zone,
	"last_task_completion_at" timestamp(6) with time zone,
	"last_task_rewarded_at" timestamp(6) with time zone,
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
CREATE UNIQUE INDEX "uidx_media_image_src" ON "media"."image" ("src");--> statement-breakpoint
CREATE INDEX "idx_media_image_userId" ON "media"."image" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_media_image_format" ON "media"."image" ("format");--> statement-breakpoint
CREATE INDEX "idx_media_image_isLocalDevelopment" ON "media"."image" ("is_local_development");--> statement-breakpoint
CREATE INDEX "idx_media_image_deletedAt" ON "media"."image" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_app_pointHistory_userId" ON "app"."point_history" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_app_pointHistory_createdAt" ON "app"."point_history" ("created_at");--> statement-breakpoint
CREATE INDEX "fts_app_project_name" ON "app"."project" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_app_project_userId" ON "app"."project" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_auth_session_userId" ON "auth"."session" ("user_id");--> statement-breakpoint
CREATE INDEX "fts_app_task_name" ON "app"."task" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "idx_app_task_taskCategoryOrderKey" ON "app"."task" ("task_category_order_key");--> statement-breakpoint
CREATE INDEX "idx_app_task_projectOrderKey" ON "app"."task" ("project_order_key");--> statement-breakpoint
CREATE INDEX "idx_app_task_taskCategoryId" ON "app"."task" ("category_id");--> statement-breakpoint
CREATE INDEX "idx_app_task_parentId" ON "app"."task" ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_app_task_userId" ON "app"."task" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_app_task_projectId" ON "app"."task" ("project_id");--> statement-breakpoint
CREATE INDEX "idx_app_task_reminderAt" ON "app"."task" ("reminder_at");--> statement-breakpoint
CREATE INDEX "idx_app_task_startAt" ON "app"."task" ("start_at");--> statement-breakpoint
CREATE INDEX "idx_app_task_deadlineAt" ON "app"."task" ("deadline_at");--> statement-breakpoint
CREATE INDEX "idx_app_task_archivedAt" ON "app"."task" ("archived_at");--> statement-breakpoint
CREATE INDEX "idx_app_task_completedAt" ON "app"."task" ("completed_at");--> statement-breakpoint
CREATE INDEX "idx_app_task_createdAt" ON "app"."task" ("created_at");--> statement-breakpoint
CREATE INDEX "fts_app_taskCategory_name" ON "app"."task_category" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_app_taskCategory_projectId" ON "app"."task_category" ("project_id");--> statement-breakpoint
CREATE INDEX "idx_auth_twoFactor_secret" ON "auth"."two_factor" ("secret");--> statement-breakpoint
CREATE INDEX "idx_auth_twoFactor_userId" ON "auth"."two_factor" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uidx_auth_user_username" ON "auth"."user" ("username");--> statement-breakpoint
CREATE INDEX "idx_auth_user_attribution" ON "auth"."user" ("attribution");--> statement-breakpoint
CREATE INDEX "idx_auth_user_deletedAt" ON "auth"."user" ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_auth_verification_identifier" ON "auth"."verification" ("identifier");--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "media"."image" ADD CONSTRAINT "image_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "app"."point_history" ADD CONSTRAINT "point_history_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "app"."project" ADD CONSTRAINT "project_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "app"."task" ADD CONSTRAINT "task_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "app"."task" ADD CONSTRAINT "task_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "app"."project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "app"."task" ADD CONSTRAINT "task_category_id_task_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "app"."task_category"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "app"."task" ADD CONSTRAINT "sfk_app_task_parentId" FOREIGN KEY ("parent_id") REFERENCES "app"."task"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "app"."task_category" ADD CONSTRAINT "task_category_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "app"."project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE CASCADE;