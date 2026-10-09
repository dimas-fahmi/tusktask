CREATE TABLE "app"."task_category" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.uuidv7(),
	"name" text DEFAULT 'untitled' NOT NULL,
	"project_id" uuid NOT NULL,
	"last_category_order_key" text,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "fts_app_taskCategory_name" ON "app"."task_category" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_app_taskCategory_projectId" ON "app"."task_category" ("project_id");--> statement-breakpoint
ALTER TABLE "app"."task_category" ADD CONSTRAINT "task_category_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "app"."project"("id") ON DELETE CASCADE;