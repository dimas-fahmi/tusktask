ALTER TABLE "media"."image" ADD COLUMN "constructed_src" text NOT NULL;--> statement-breakpoint
ALTER TABLE "media"."image" ALTER COLUMN "src" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "media"."image" ADD CONSTRAINT "image_constructed_src_key" UNIQUE("constructed_src");