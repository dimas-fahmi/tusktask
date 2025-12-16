ALTER TABLE "notification" ALTER COLUMN "payload" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "notification" ALTER COLUMN "payload" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_receiver" ADD COLUMN "created_at" timestamp (6) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "body";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "type";