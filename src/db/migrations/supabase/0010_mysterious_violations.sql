DROP INDEX "public_notificationReceiver_notificationId_idx";--> statement-breakpoint
DROP INDEX "public_notificationReceiver_userId_idx";--> statement-breakpoint
ALTER TABLE "notification_receive" DROP CONSTRAINT "public_notificationReceiver_cpk";--> statement-breakpoint
ALTER TABLE "notification_receive" ADD CONSTRAINT "public_notificationReceive_cpk" PRIMARY KEY("notification_id","user_id");--> statement-breakpoint
CREATE INDEX "public_notificationReceive_notificationId_idx" ON "notification_receive" USING btree ("notification_id");--> statement-breakpoint
CREATE INDEX "public_notificationReceive_userId_idx" ON "notification_receive" USING btree ("user_id");