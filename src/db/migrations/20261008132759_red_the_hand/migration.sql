ALTER TABLE "app"."project" ADD COLUMN "last_project_order_key" text;--> statement-breakpoint
ALTER TABLE "app"."project" ALTER COLUMN "icon_id" SET DEFAULT 'folder';--> statement-breakpoint
ALTER TABLE "app"."project" ALTER COLUMN "icon_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."project" ALTER COLUMN "view_layout" SET DEFAULT 'list';--> statement-breakpoint
ALTER TABLE "app"."project" ALTER COLUMN "view_layout" SET NOT NULL;