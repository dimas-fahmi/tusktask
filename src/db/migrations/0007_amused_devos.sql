ALTER TABLE "messages" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "updatedAt" timestamp (6) with time zone;