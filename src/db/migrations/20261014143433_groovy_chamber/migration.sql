ALTER TABLE "app"."project" ADD COLUMN "last_category_order_key" text;--> statement-breakpoint
ALTER TABLE "app"."task_category" ADD COLUMN "project_order_key" text;