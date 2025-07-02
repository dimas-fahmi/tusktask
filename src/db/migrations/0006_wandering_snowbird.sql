ALTER TABLE "messages" DROP CONSTRAINT "messages_receiverId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_teamId_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "receiverId";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "teamId";