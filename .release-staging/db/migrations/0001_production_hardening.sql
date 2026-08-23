ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profileCompleted" boolean DEFAULT false NOT NULL;
ALTER TABLE "local_users" ADD COLUMN IF NOT EXISTS "profileCompleted" boolean DEFAULT false NOT NULL;
ALTER TABLE "local_users" ADD COLUMN IF NOT EXISTS "lastSignInAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "userId" integer DEFAULT 0 NOT NULL;

CREATE INDEX IF NOT EXISTS "users_last_sign_in_at_idx" ON "users" ("lastSignInAt");
CREATE INDEX IF NOT EXISTS "local_users_last_sign_in_at_idx" ON "local_users" ("lastSignInAt");
CREATE INDEX IF NOT EXISTS "contacts_status_created_at_idx" ON "contacts" ("status", "createdAt");
CREATE INDEX IF NOT EXISTS "blog_posts_published_created_at_idx" ON "blog_posts" ("published", "createdAt");
CREATE INDEX IF NOT EXISTS "blog_posts_category_published_created_at_idx" ON "blog_posts" ("category", "published", "createdAt");
CREATE INDEX IF NOT EXISTS "projects_filter_created_at_idx" ON "projects" ("type", "status", "featured", "createdAt");
CREATE INDEX IF NOT EXISTS "testimonials_featured_created_at_idx" ON "testimonials" ("featured", "createdAt");
CREATE INDEX IF NOT EXISTS "chat_messages_user_session_created_at_idx" ON "chat_messages" ("userId", "sessionId", "createdAt");
CREATE INDEX IF NOT EXISTS "construction_leads_status_created_at_idx" ON "construction_leads" ("lead_status", "createdAt");
CREATE INDEX IF NOT EXISTS "cost_calculator_requests_created_at_idx" ON "cost_calculator_requests" ("createdAt");
