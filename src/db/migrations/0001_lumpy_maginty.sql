ALTER TABLE "tasks" ADD COLUMN "path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "budget" integer;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "expenses" integer;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "budget" integer;