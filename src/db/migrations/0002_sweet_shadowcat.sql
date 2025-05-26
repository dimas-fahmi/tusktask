ALTER TABLE "tasks" ADD COLUMN "type" text DEFAULT 'task' NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "price" integer;