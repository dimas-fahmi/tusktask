CREATE SCHEMA "main";
--> statement-breakpoint
CREATE SCHEMA "user";
--> statement-breakpoint
CREATE TYPE "main"."project_status_enum" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TYPE "main"."status_enum" AS ENUM('pending', 'ongoing', 'archived', 'completed');--> statement-breakpoint
CREATE TABLE "user"."profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"username" text,
	"avatar" text,
	"created_at" timestamp (3) with time zone,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "main"."projects" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"owner_id" uuid NOT NULL,
	"status" "main"."project_status_enum" DEFAULT 'active' NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"deleted_at" timestamp (3) with time zone
);
--> statement-breakpoint
CREATE TABLE "main"."tasks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"project_id" uuid NOT NULL,
	"parent_id" uuid,
	"owner_id" uuid NOT NULL,
	"status" "main"."status_enum" DEFAULT 'pending' NOT NULL,
	"start_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"reminder_at" timestamp (3) with time zone,
	"finish_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone,
	"deleted_at" timestamp (3) with time zone
);
--> statement-breakpoint
ALTER TABLE "user"."profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."projects" ADD CONSTRAINT "projects_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "main"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."tasks" ADD CONSTRAINT "tasks_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "user"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."tasks" ADD CONSTRAINT "FK_MAIN_SCHEMA_TASKS_PARENT_ID" FOREIGN KEY ("parent_id") REFERENCES "main"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "FTS_USER_SCHEMA_PROFILES_NAME" ON "user"."profiles" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE UNIQUE INDEX "UIDX_USER_SCHEMA_PROFILES_USERNAME" ON "user"."profiles" USING btree ("username");--> statement-breakpoint
CREATE INDEX "FTS_MAIN_SCHEMA_PROJECTS_NAME" ON "main"."projects" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "FTS_MAIN_SCHEMA_PROJECTS_DESCRIPTION" ON "main"."projects" USING gin (to_tsvector('english', "description"));--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_PROJECTS_OWNER_ID" ON "main"."projects" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_PROJECTS_STATUS" ON "main"."projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_PROJECTS_DELETED_AT" ON "main"."projects" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "FTS_MAIN_SCHEMA_TASKS_NAME" ON "main"."tasks" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "FTS_MAIN_SCHEMA_TASKS_DESCRIPTION" ON "main"."tasks" USING gin (to_tsvector('english', "description"));--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_PROJECT_ID" ON "main"."tasks" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_PARENT_ID" ON "main"."tasks" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_OWNER_ID" ON "main"."tasks" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_STATUS" ON "main"."tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_START_AT" ON "main"."tasks" USING btree ("start_at");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_REMINDER_AT" ON "main"."tasks" USING btree ("reminder_at");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_FINISH_AT" ON "main"."tasks" USING btree ("finish_at");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_CREATED_AT" ON "main"."tasks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "IDX_MAIN_SCHEMA_TASKS_DELETED_AT" ON "main"."tasks" USING btree ("deleted_at");