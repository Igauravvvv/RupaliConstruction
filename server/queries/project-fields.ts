import { sql } from "drizzle-orm";
import { projects } from "../../db/schema.js";

// Optional fields may be absent on databases created before newer migrations.
// Reading them from the row JSON returns null instead of failing the portfolio.
export const publicProjectFields = {
  id: projects.id, name: projects.name, slug: projects.slug,
  description: projects.description, location: projects.location,
  area: projects.area, duration: projects.duration, type: projects.type,
  status: projects.status, images: projects.images, featured: projects.featured,
  completionDate: projects.completionDate, createdAt: projects.createdAt,
  reviewerName: sql<string | null>`to_jsonb(${projects})->>'reviewerName'`,
  reviewerRole: sql<string | null>`to_jsonb(${projects})->>'reviewerRole'`,
  reviewText: sql<string | null>`to_jsonb(${projects})->>'reviewText'`,
  instagramVideoUrl: sql<string | null>`to_jsonb(${projects})->>'instagramVideoUrl'`,
  processSteps: sql<string | null>`to_jsonb(${projects})->>'process_steps'`,
};
