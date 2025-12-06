CREATE TABLE "image" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"owner_id" text,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp (6) with time zone
);
--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "app_auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "public_image_name_fts" ON "image" USING gin (to_tsvector('english', "name"));--> statement-breakpoint
CREATE INDEX "public_image_ownerId_idx" ON "image" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "public_image_deletedAt_idx" ON "image" USING btree ("deleted_at");