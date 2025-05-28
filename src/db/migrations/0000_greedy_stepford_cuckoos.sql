CREATE TABLE "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "authenticators" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticators_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"senderId" text NOT NULL,
	"receiverId" text NOT NULL,
	"createdAt" timestamp (6) with time zone DEFAULT now(),
	"respondToId" text
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"type" text DEFAULT 'notification' NOT NULL,
	"senderId" text NOT NULL,
	"receiverId" text NOT NULL,
	"createdAt" timestamp (6) with time zone DEFAULT now(),
	"markReadAt" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdById" text,
	"ownerId" text NOT NULL,
	"teamId" text NOT NULL,
	"parentId" text,
	"createdAt" timestamp (6) with time zone DEFAULT now(),
	"updatedAt" timestamp (6) with time zone,
	"status" text DEFAULT 'not_started' NOT NULL,
	"claimedById" text,
	"completedById" text,
	"startAt" timestamp (6) with time zone DEFAULT now(),
	"deadlineAt" timestamp (6) with time zone,
	"completedAt" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE "teamMembers" (
	"teamId" text,
	"userId" text,
	"userRole" text DEFAULT 'assignee' NOT NULL,
	"joinAt" timestamp (6) with time zone DEFAULT now(),
	CONSTRAINT "TEAM_MEMBERS_PRIMARY_KEYS" PRIMARY KEY("teamId","userId")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdById" text,
	"ownerId" text NOT NULL,
	"type" text DEFAULT 'private',
	"createdAt" timestamp (6) with time zone DEFAULT now(),
	"updatedAt" timestamp (6) with time zone,
	"deletedAt" timestamp (6) with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"username" text NOT NULL,
	"notificationSoundEnable" boolean DEFAULT true,
	"reminderSoundEnable" boolean DEFAULT true,
	"email" text,
	"timezone" text DEFAULT 'Asia/Jakarta' NOT NULL,
	"emailVerified" timestamp (6) with time zone,
	"registration" text DEFAULT 'username' NOT NULL,
	"theme" text DEFAULT 'default' NOT NULL,
	"image" text,
	"createdAt" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp (6) with time zone,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_users_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "MESSAGES_RESPOND_TO_ID_FK" FOREIGN KEY ("respondToId") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiverId_users_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdById_users_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_claimedById_users_id_fk" FOREIGN KEY ("claimedById") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_completedById_users_id_fk" FOREIGN KEY ("completedById") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "TASKS_PARENT_FK" FOREIGN KEY ("parentId") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamMembers" ADD CONSTRAINT "teamMembers_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teamMembers" ADD CONSTRAINT "teamMembers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_createdById_users_id_fk" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "NOTIFICATIONS_SENDER_IDX" ON "notifications" USING btree ("senderId");--> statement-breakpoint
CREATE INDEX "NOTIFICATIONS_RECEIVER_IDX" ON "notifications" USING btree ("receiverId");--> statement-breakpoint
CREATE INDEX "NOTIFICATIONS_TYPE_IDX" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "TASKS_CREATED_BY_IDX" ON "tasks" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "TASKS_OWNER_ID_IDX" ON "tasks" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "TASKS_TEAM_ID_IDX" ON "tasks" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "TASKS_PARENT_ID_IDX" ON "tasks" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "TASKS_CLAIMED_BY_IDX" ON "tasks" USING btree ("claimedById");--> statement-breakpoint
CREATE INDEX "TASKS_COMPLETED_BY_IDX" ON "tasks" USING btree ("completedById");--> statement-breakpoint
CREATE INDEX "TEAM_MEMBERS_USER_ID_IDX" ON "teamMembers" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "TEAM_MEMBERS_TEAM_ID_IDX" ON "teamMembers" USING btree ("teamId");--> statement-breakpoint
CREATE INDEX "TEAMS_CREATED_BY_IDX" ON "teams" USING btree ("createdById");--> statement-breakpoint
CREATE INDEX "TEAMS_OWNER_IDX" ON "teams" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "USERS_NAME_IDX" ON "users" USING btree ("name");