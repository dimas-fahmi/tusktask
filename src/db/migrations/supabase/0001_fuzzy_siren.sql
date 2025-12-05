CREATE TYPE "public"."notification_type_enum" AS ENUM('project_invitation', 'created_new_task', 'claimed_task', 'assigned_task', 'completed_task', 'rejected_invitation', 'joined_project', 'left_project', 'promoted_member', 'demoted_member', 'archived_task', 'updated_task', 'new_message', 'system_alert', 'generic_broadcast', 'system_broadcast', 'system_positive', 'system_negative');--> statement-breakpoint
CREATE TYPE "app_auth"."onboarding_status_enum" AS ENUM('name', 'username', 'image', 'settings', 'completed');--> statement-breakpoint
CREATE TYPE "public"."project_membership_type_enum" AS ENUM('owner', 'admin', 'member', 'observer');--> statement-breakpoint
CREATE TYPE "public"."project_type_enum" AS ENUM('primary', 'regular', 'co-op');--> statement-breakpoint
CREATE TYPE "public"."task_status_enum" AS ENUM('pending', 'on_process', 'aborted', 'delayed', 'continued');--> statement-breakpoint
CREATE TYPE "app_auth"."theme_enum" AS ENUM('default', 'dark', 'popBella', 'brownBear', 'cofeePuff', 'jettBlack');--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"type" "notification_type_enum" NOT NULL,
	"payload" json,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_receiver" (
	"notification_id" uuid,
	"user_id" text,
	"is_archived" boolean DEFAULT false NOT NULL,
	"read_at" timestamp (6) with time zone,
	CONSTRAINT "public_notificationReceiver_cpk" PRIMARY KEY("notification_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "project_type_enum",
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_by_id" text,
	"owner_id" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone,
	"deleted_at" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE "project_membership" (
	"project_id" uuid,
	"user_id" text,
	"type" "project_membership_type_enum" NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone,
	"deleted_at" timestamp (6) with time zone,
	CONSTRAINT "public_projectMembership_cpk" PRIMARY KEY("project_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"priority" integer,
	"status" "task_status_enum" DEFAULT 'pending' NOT NULL,
	"created_by_id" text,
	"owner_id" text NOT NULL,
	"claimed_by_id" text,
	"completed_by_id" text,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"start_at" timestamp (6) with time zone,
	"end_at" timestamp (6) with time zone,
	"completed_at" timestamp (6) with time zone,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone,
	"deleted_at" timestamp (6) with time zone
);
--> statement-breakpoint
ALTER TABLE "app_auth"."user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "app_auth"."user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "app_auth"."user" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "app_auth"."user" ADD COLUMN "onboarding_status" "app_auth"."onboarding_status_enum" DEFAULT 'name' NOT NULL;--> statement-breakpoint
ALTER TABLE "app_auth"."user" ADD COLUMN "theme" "app_auth"."theme_enum" DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "app_auth"."user" ADD COLUMN "is_silent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_receiver" ADD CONSTRAINT "notification_receiver_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_receiver" ADD CONSTRAINT "notification_receiver_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "app_auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "app_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_membership" ADD CONSTRAINT "project_membership_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_membership" ADD CONSTRAINT "project_membership_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "app_auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "app_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_claimed_by_id_user_id_fk" FOREIGN KEY ("claimed_by_id") REFERENCES "app_auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_completed_by_id_user_id_fk" FOREIGN KEY ("completed_by_id") REFERENCES "app_auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "public_task_parentId_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "public_notificationReceiver_notificationId_idx" ON "notification_receiver" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "public_notificationReceiver_userId_idx" ON "notification_receiver" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "public_project_name_fts" ON "project" USING gin (to_tsvector('english',"name"));--> statement-breakpoint
CREATE INDEX "public_project_type_idx" ON "project" USING btree ("type");--> statement-breakpoint
CREATE INDEX "public_project_isPinned_idx" ON "project" USING btree ("is_pinned");--> statement-breakpoint
CREATE INDEX "public_project_isArchived_idx" ON "project" USING btree ("is_archived");--> statement-breakpoint
CREATE INDEX "public_project_createdById_idx" ON "project" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "public_project_ownerId_idx" ON "project" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "public_project_createdAt_idx" ON "project" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "public_project_updatedAt_idx" ON "project" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "public_project_deletedAt_idx" ON "project" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "public_task_name_fts" ON "task" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "public_task_priority_idx" ON "task" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "public_task_status_idx" ON "task" USING btree ("status");--> statement-breakpoint
CREATE INDEX "public_task_createdById_idx" ON "task" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "public_task_ownerId_idx" ON "task" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "public_task_claimedById_idx" ON "task" USING btree ("claimed_by_id");--> statement-breakpoint
CREATE INDEX "public_task_completedById_idx" ON "task" USING btree ("completed_by_id");--> statement-breakpoint
CREATE INDEX "public_task_isPinned_idx" ON "task" USING btree ("is_pinned");--> statement-breakpoint
CREATE INDEX "public_task_isArchived_idx" ON "task" USING btree ("is_archived");--> statement-breakpoint
CREATE INDEX "public_task_projectId_idx" ON "task" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "public_task_parentId_idx" ON "task" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "public_task_startAt_idx" ON "task" USING btree ("start_at");--> statement-breakpoint
CREATE INDEX "public_task_endAt_idx" ON "task" USING btree ("end_at");--> statement-breakpoint
CREATE INDEX "public_task_completedAt_idx" ON "task" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "public_task_createdAt_idx" ON "task" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "public_task_updatedAt_idx" ON "task" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "public_task_deletedAt_idx" ON "task" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "app_auth"."user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");