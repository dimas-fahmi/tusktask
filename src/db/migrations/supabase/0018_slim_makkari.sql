ALTER TYPE "public"."event_type_enum" ADD VALUE 'joined_to_a_project';--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "deleted_at" timestamp (6) with time zone;