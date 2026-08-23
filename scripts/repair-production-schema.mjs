import "dotenv/config";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

// This repairs databases that were provisioned before migration tracking. Every
// operation is additive or `IF NOT EXISTS`; it does not delete or rewrite data.
const statements = [
  `DO $$ BEGIN CREATE TYPE auth_provider AS ENUM ('local', 'google'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE chat_role AS ENUM ('user', 'assistant'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'follow-up', 'converted', 'closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE project_status AS ENUM ('ongoing', 'completed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE project_type AS ENUM ('residential', 'commercial', 'renovation', 'interior'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE role AS ENUM ('user', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN CREATE TYPE status AS ENUM ('new', 'read', 'replied', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE TABLE IF NOT EXISTS users (id serial PRIMARY KEY, "unionId" varchar(255) NOT NULL UNIQUE, name varchar(255), email varchar(320), "phoneNumber" varchar(50), avatar text, role role DEFAULT 'user' NOT NULL, "profileCompleted" boolean DEFAULT false NOT NULL, "createdAt" timestamp DEFAULT now() NOT NULL, "updatedAt" timestamp DEFAULT now() NOT NULL, "lastSignInAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS local_users (id serial PRIMARY KEY, "uniqueId" varchar(20) NOT NULL UNIQUE, username varchar(255) NOT NULL UNIQUE, "displayName" varchar(255), email varchar(320), "phoneNumber" varchar(50), "passwordHash" varchar(255), "googleId" varchar(255) UNIQUE, avatar text, "authProvider" auth_provider DEFAULT 'local' NOT NULL, role role DEFAULT 'user' NOT NULL, "profileCompleted" boolean DEFAULT false NOT NULL, "createdAt" timestamp DEFAULT now() NOT NULL, "updatedAt" timestamp DEFAULT now() NOT NULL, "lastSignInAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS contacts (id serial PRIMARY KEY, name varchar(255) NOT NULL, email varchar(320) NOT NULL, phone varchar(50), city varchar(100), service varchar(100), budget varchar(100), message text, status status DEFAULT 'new' NOT NULL, "createdAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS blog_posts (id serial PRIMARY KEY, title varchar(255) NOT NULL, slug varchar(255) NOT NULL UNIQUE, excerpt text, content text NOT NULL, "coverImage" text, category varchar(100), tags text, author varchar(255), published boolean DEFAULT false NOT NULL, featured boolean DEFAULT false NOT NULL, "viewCount" integer DEFAULT 0 NOT NULL, "createdAt" timestamp DEFAULT now() NOT NULL, "updatedAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS projects (id serial PRIMARY KEY, name varchar(255) NOT NULL, slug varchar(255) NOT NULL UNIQUE, description text, location varchar(255), area varchar(100), duration varchar(100), type project_type DEFAULT 'residential' NOT NULL, status project_status DEFAULT 'completed' NOT NULL, images text, featured boolean DEFAULT false NOT NULL, "completionDate" varchar(50), cost varchar(100), "reviewerName" varchar(120), "reviewerRole" varchar(160), "reviewText" text, "instagramVideoUrl" text, process_steps text, "createdAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS testimonials (id serial PRIMARY KEY, name varchar(255) NOT NULL, location varchar(255), project varchar(255), rating integer DEFAULT 5 NOT NULL, content text NOT NULL, image text, featured boolean DEFAULT false NOT NULL, "createdAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS construction_leads (id serial PRIMARY KEY, "referenceId" varchar(20) NOT NULL UNIQUE, name varchar(255), phone varchar(50), email varchar(320), state varchar(100), city varchar(100), area varchar(255), "pinCode" varchar(20), "projectType" varchar(100), "residentialType" varchar(100), "plotSize" varchar(100), "constructionStage" varchar(100), budget varchar(100), timeline varchar(100), "preferredCallTime" varchar(100), "enquiryType" varchar(100) DEFAULT 'construction' NOT NULL, lead_status lead_status DEFAULT 'new' NOT NULL, "assignedTo" varchar(255), remarks text, "createdAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS cost_calculator_requests (id serial PRIMARY KEY, "referenceId" varchar(20) NOT NULL UNIQUE, city varchar(100), "propertyType" varchar(100), "plotSize" varchar(100), floors integer, quality varchar(50), "estimatedCost" varchar(100), name varchar(255), phone varchar(50), email varchar(320), "createdAt" timestamp DEFAULT now() NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS chat_messages (id serial PRIMARY KEY, "userId" integer DEFAULT 0 NOT NULL, "sessionId" varchar(255) NOT NULL, role chat_role NOT NULL, content text NOT NULL, "createdAt" timestamp DEFAULT now() NOT NULL)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS "profileCompleted" boolean DEFAULT false NOT NULL`,
  `ALTER TABLE local_users ADD COLUMN IF NOT EXISTS "profileCompleted" boolean DEFAULT false NOT NULL`,
  `ALTER TABLE local_users ADD COLUMN IF NOT EXISTS "lastSignInAt" timestamp DEFAULT now() NOT NULL`,
  `ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS "userId" integer DEFAULT 0 NOT NULL`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "reviewerName" varchar(120)`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "reviewerRole" varchar(160)`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "reviewText" text`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "instagramVideoUrl" text`,
  `CREATE INDEX IF NOT EXISTS users_last_sign_in_at_idx ON users ("lastSignInAt")`,
  `CREATE INDEX IF NOT EXISTS local_users_last_sign_in_at_idx ON local_users ("lastSignInAt")`,
  `CREATE INDEX IF NOT EXISTS contacts_status_created_at_idx ON contacts (status, "createdAt")`,
  `CREATE INDEX IF NOT EXISTS blog_posts_published_created_at_idx ON blog_posts (published, "createdAt")`,
  `CREATE INDEX IF NOT EXISTS blog_posts_category_published_created_at_idx ON blog_posts (category, published, "createdAt")`,
  `CREATE INDEX IF NOT EXISTS projects_filter_created_at_idx ON projects (type, status, featured, "createdAt")`,
  `CREATE INDEX IF NOT EXISTS testimonials_featured_created_at_idx ON testimonials (featured, "createdAt")`,
  `CREATE INDEX IF NOT EXISTS chat_messages_user_session_created_at_idx ON chat_messages ("userId", "sessionId", "createdAt")`,
  `CREATE INDEX IF NOT EXISTS construction_leads_status_created_at_idx ON construction_leads (lead_status, "createdAt")`,
  `CREATE INDEX IF NOT EXISTS cost_calculator_requests_created_at_idx ON cost_calculator_requests ("createdAt")`,
];

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", connect_timeout: 10 });
try {
  for (const statement of statements) await sql.unsafe(statement);
  console.log("Production schema repair completed successfully.");
} finally {
  await sql.end();
}
