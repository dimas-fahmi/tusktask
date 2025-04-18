ALTER TABLE "notifications" RENAME COLUMN "markRead_at" TO "mark_read_at";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "dealine_at" TO "deadline_at";--> statement-breakpoint
ALTER TABLE "tasks" RENAME COLUMN "dealine_at" TO "deadline_at";--> statement-breakpoint
DROP INDEX "projects_deadline_at_idx";--> statement-breakpoint
DROP INDEX "tasks_deadline_at_idx";--> statement-breakpoint
CREATE INDEX "projects_deadline_at_idx" ON "projects" USING btree ("deadline_at");--> statement-breakpoint
CREATE INDEX "tasks_deadline_at_idx" ON "tasks" USING btree ("deadline_at");