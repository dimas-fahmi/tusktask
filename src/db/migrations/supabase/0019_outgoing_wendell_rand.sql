ALTER TABLE "notification_receive" RENAME TO "notification_receipt";--> statement-breakpoint
ALTER TABLE "notification_receipt" DROP CONSTRAINT "notification_receive_notification_id_notification_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_receipt" DROP CONSTRAINT "notification_receive_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "public_notificationReceive_notificationId_idx";--> statement-breakpoint
DROP INDEX "public_notificationReceive_userId_idx";--> statement-breakpoint
ALTER TABLE "notification_receipt" DROP CONSTRAINT "public_notificationReceive_cpk";--> statement-breakpoint
ALTER TABLE "notification_receipt" ADD CONSTRAINT "public_notificationReceipt_cpk" PRIMARY KEY("notification_id","user_id");--> statement-breakpoint
ALTER TABLE "notification_receipt" ADD CONSTRAINT "notification_receipt_notification_id_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_receipt" ADD CONSTRAINT "notification_receipt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "public_notificationReceipt_notificationId_idx" ON "notification_receipt" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "public_notificationReceipt_userId_idx" ON "notification_receipt" USING btree ("user_id");