CREATE TABLE "conversationParticipants" (
	"conversationId" text NOT NULL,
	"userId" text NOT NULL,
	"role" text,
	"joinAt" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"type" text NOT NULL,
	"image" text
);
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "conversationId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "conversationParticipants" ADD CONSTRAINT "conversationParticipants_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversationParticipants" ADD CONSTRAINT "conversationParticipants_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;