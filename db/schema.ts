import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("status", ["new", "read", "replied", "archived"]);
export const projectTypeEnum = pgEnum("project_type", ["residential", "commercial", "renovation", "interior"]);
export const projectStatusEnum = pgEnum("project_status", ["ongoing", "completed"]);
export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant"]);

// OAuth users (managed by Kimi auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  profileCompleted: boolean("profileCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
}, (table) => [index("users_last_sign_in_at_idx").on(table.lastSignInAt)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Auth provider enum
export const authProviderEnum = pgEnum("auth_provider", ["local", "google"]);

// Local auth users (username/password + Google OAuth)
export const localUsers = pgTable("local_users", {
  id: serial("id").primaryKey(),
  uniqueId: varchar("uniqueId", { length: 20 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  displayName: varchar("displayName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  googleId: varchar("googleId", { length: 255 }).unique(),
  avatar: text("avatar"),
  authProvider: authProviderEnum("authProvider").default("local").notNull(),
  role: roleEnum("role").default("user").notNull(),
  profileCompleted: boolean("profileCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
}, (table) => [index("local_users_last_sign_in_at_idx").on(table.lastSignInAt)]);

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

// Contact form submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  city: varchar("city", { length: 100 }),
  service: varchar("service", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  message: text("message"),
  status: statusEnum("status").default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("contacts_status_created_at_idx").on(table.status, table.createdAt)]);

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("coverImage"),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  author: varchar("author", { length: 255 }),
  published: boolean("published").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  viewCount: integer("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => [
  index("blog_posts_published_created_at_idx").on(table.published, table.createdAt),
  index("blog_posts_category_published_created_at_idx").on(table.category, table.published, table.createdAt),
]);

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  area: varchar("area", { length: 100 }),
  duration: varchar("duration", { length: 100 }),
  type: projectTypeEnum("type").default("residential").notNull(),
  status: projectStatusEnum("status").default("completed").notNull(),
  images: text("images"),
  featured: boolean("featured").default(false).notNull(),
  completionDate: varchar("completionDate", { length: 50 }),
  cost: varchar("cost", { length: 100 }),
  reviewerName: varchar("reviewerName", { length: 120 }),
  reviewerRole: varchar("reviewerRole", { length: 160 }),
  reviewText: text("reviewText"),
  instagramVideoUrl: text("instagramVideoUrl"),
  processSteps: text("process_steps"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("projects_filter_created_at_idx").on(table.type, table.status, table.featured, table.createdAt)]);

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  project: varchar("project", { length: 255 }),
  rating: integer("rating").default(5).notNull(),
  content: text("content").notNull(),
  image: text("image"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("testimonials_featured_created_at_idx").on(table.featured, table.createdAt)]);

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().default(0),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("chat_messages_user_session_created_at_idx").on(table.userId, table.sessionId, table.createdAt)]);

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Lead status enum
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "follow-up", "converted", "closed"]);

// Construction Leads (from chatbot guided flow)
export const constructionLeads = pgTable("construction_leads", {
  id: serial("id").primaryKey(),
  referenceId: varchar("referenceId", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  state: varchar("state", { length: 100 }),
  city: varchar("city", { length: 100 }),
  area: varchar("area", { length: 255 }),
  pinCode: varchar("pinCode", { length: 20 }),
  projectType: varchar("projectType", { length: 100 }),
  residentialType: varchar("residentialType", { length: 100 }),
  plotSize: varchar("plotSize", { length: 100 }),
  constructionStage: varchar("constructionStage", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  timeline: varchar("timeline", { length: 100 }),
  preferredCallTime: varchar("preferredCallTime", { length: 100 }),
  enquiryType: varchar("enquiryType", { length: 100 }).default("construction").notNull(),
  status: leadStatusEnum("lead_status").default("new").notNull(),
  assignedTo: varchar("assignedTo", { length: 255 }),
  remarks: text("remarks"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("construction_leads_status_created_at_idx").on(table.status, table.createdAt)]);

export type ConstructionLead = typeof constructionLeads.$inferSelect;
export type InsertConstructionLead = typeof constructionLeads.$inferInsert;

// Cost Calculator Requests
export const costCalculatorRequests = pgTable("cost_calculator_requests", {
  id: serial("id").primaryKey(),
  referenceId: varchar("referenceId", { length: 20 }).notNull().unique(),
  city: varchar("city", { length: 100 }),
  propertyType: varchar("propertyType", { length: 100 }),
  plotSize: varchar("plotSize", { length: 100 }),
  floors: integer("floors"),
  quality: varchar("quality", { length: 50 }),
  estimatedCost: varchar("estimatedCost", { length: 100 }),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("cost_calculator_requests_created_at_idx").on(table.createdAt)]);

export type CostCalculatorRequest = typeof costCalculatorRequests.$inferSelect;
export type InsertCostCalculatorRequest = typeof costCalculatorRequests.$inferInsert;
