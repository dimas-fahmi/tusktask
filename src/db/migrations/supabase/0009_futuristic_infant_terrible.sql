ALTER TABLE "notification_receiver" RENAME TO "notification_receive";--> statement-breakpoint
ALTER TABLE "notification_receive" DROP CONSTRAINT "notification_receiver_notification_id_notification_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_receive" DROP CONSTRAINT "notification_receiver_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_receive" ADD CONSTRAINT "notification_receive_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_receive" ADD CONSTRAINT "notification_receive_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app_auth"."user"("id") ON DELETE cascade ON UPDATE no action;