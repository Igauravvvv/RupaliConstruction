ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "reviewerName" varchar(120);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "reviewerRole" varchar(160);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "reviewText" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "instagramVideoUrl" text;
