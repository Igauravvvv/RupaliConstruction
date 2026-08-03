CREATE TYPE "public"."auth_provider" AS ENUM('local', 'google');--> statement-breakpoint
CREATE TYPE "public"."chat_role" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'follow-up', 'converted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('residential', 'commercial', 'renovation', 'interior');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('new', 'read', 'replied', 'archived');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"coverImage" text,
	"category" varchar(100),
	"tags" text,
	"author" varchar(255),
	"published" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(255) NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "construction_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"referenceId" varchar(20) NOT NULL,
	"name" varchar(255),
	"phone" varchar(50),
	"email" varchar(320),
	"state" varchar(100),
	"city" varchar(100),
	"area" varchar(255),
	"pinCode" varchar(20),
	"projectType" varchar(100),
	"residentialType" varchar(100),
	"plotSize" varchar(100),
	"constructionStage" varchar(100),
	"budget" varchar(100),
	"timeline" varchar(100),
	"preferredCallTime" varchar(100),
	"enquiryType" varchar(100) DEFAULT 'construction' NOT NULL,
	"lead_status" "lead_status" DEFAULT 'new' NOT NULL,
	"assignedTo" varchar(255),
	"remarks" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "construction_leads_referenceId_unique" UNIQUE("referenceId")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"city" varchar(100),
	"service" varchar(100),
	"budget" varchar(100),
	"message" text,
	"status" "status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cost_calculator_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"referenceId" varchar(20) NOT NULL,
	"city" varchar(100),
	"propertyType" varchar(100),
	"plotSize" varchar(100),
	"floors" integer,
	"quality" varchar(50),
	"estimatedCost" varchar(100),
	"name" varchar(255),
	"phone" varchar(50),
	"email" varchar(320),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cost_calculator_requests_referenceId_unique" UNIQUE("referenceId")
);
--> statement-breakpoint
CREATE TABLE "local_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uniqueId" varchar(20) NOT NULL,
	"username" varchar(255) NOT NULL,
	"displayName" varchar(255),
	"email" varchar(320),
	"phoneNumber" varchar(50),
	"passwordHash" varchar(255),
	"googleId" varchar(255),
	"avatar" text,
	"authProvider" "auth_provider" DEFAULT 'local' NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "local_users_uniqueId_unique" UNIQUE("uniqueId"),
	CONSTRAINT "local_users_username_unique" UNIQUE("username"),
	CONSTRAINT "local_users_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"location" varchar(255),
	"area" varchar(100),
	"duration" varchar(100),
	"type" "project_type" DEFAULT 'residential' NOT NULL,
	"status" "project_status" DEFAULT 'completed' NOT NULL,
	"images" text,
	"featured" boolean DEFAULT false NOT NULL,
	"completionDate" varchar(50),
	"cost" varchar(100),
	"process_steps" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255),
	"project" varchar(255),
	"rating" integer DEFAULT 5 NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"featured" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"unionId" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(320),
	"phoneNumber" varchar(50),
	"avatar" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignInAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_unionId_unique" UNIQUE("unionId")
);
