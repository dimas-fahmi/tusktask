DROP INDEX "public_project_type_idx";--> statement-breakpoint
ALTER TABLE "project_membership" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_membership" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."project_type_enum";