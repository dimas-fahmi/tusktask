ALTER TABLE "notification" ADD COLUMN "actor_id" text;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "app_auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "public_notification_actorId_idx" ON "notification" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "public_notification_projectId_idx" ON "notification" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "public_notification_taskId_idx" ON "notification" USING btree ("task_id");