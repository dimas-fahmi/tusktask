ALTER TABLE "app"."task" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "app"."task" ADD COLUMN "project_order_key" text;--> statement-breakpoint
ALTER TABLE "app"."task" ADD COLUMN "task_category_order_key" text;--> statement-breakpoint
CREATE INDEX "idx_app_task_taskCategoryOrderKey" ON "app"."task" ("task_category_order_key");--> statement-breakpoint
CREATE INDEX "idx_app_task_projectOrderKey" ON "app"."task" ("project_order_key");--> statement-breakpoint
CREATE INDEX "idx_app_task_taskCategoryId" ON "app"."task" ("category_id");--> statement-breakpoint
ALTER TABLE "app"."task" ADD CONSTRAINT "task_category_id_task_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "app"."task_category"("id") ON DELETE CASCADE;