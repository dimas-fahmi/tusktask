ALTER TABLE "messages" ALTER COLUMN "receiverId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "conversationParticipants" ADD CONSTRAINT "CONVERSATIONS_PARTICIPANTS_PRIMARY_KEYS" PRIMARY KEY("conversationId","userId");--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "teamId" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "CONVERSATIONS_PARTICIPANTS_CONVERSATIONS_ID_IDX" ON "conversationParticipants" USING btree ("conversationId");--> statement-breakpoint
CREATE INDEX "CONVERSATIONS_PARTICIPANTS_USER_ID_IDX" ON "conversationParticipants" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "CONVERSATIONS_NAME_IDX" ON "conversations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "CONVERSATIONS_TYPE_IDX" ON "conversations" USING btree ("type");