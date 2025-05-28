ALTER TABLE "notifications" ALTER COLUMN "type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "teamId" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "category" text DEFAULT 'generic' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "teamId" text;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "NOTIFICATIONS_STATUS_IDX" ON "notifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "NOTIFICATIONS_CATEGORY_IDX" ON "notifications" USING btree ("category");--> statement-breakpoint
CREATE INDEX "NOTIFICATIONS_TEAM_IDX" ON "notifications" USING btree ("teamId");