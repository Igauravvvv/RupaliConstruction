import type { Context } from "hono";
import { getDb } from "./queries/connection.js";
import { projects, blogPosts } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function sitemapHandler(c: Context) {
  const baseUrl = "https://rupaliconstruction.com";
  const now = new Date().toISOString().split("T")[0];

  // Core static pages with priority and change frequency
  const staticRoutes = [
    { url: "", priority: "1.0", changefreq: "daily" },
    { url: "/services", priority: "0.9", changefreq: "weekly" },
    { url: "/projects", priority: "0.9", changefreq: "weekly" },
    { url: "/blog", priority: "0.8", changefreq: "daily" },
    { url: "/leadership", priority: "0.8", changefreq: "monthly" },
    { url: "/brand-standards", priority: "0.7", changefreq: "monthly" },
    { url: "/contact", priority: "0.8", changefreq: "monthly" },
  ];

  let dynamicProjects: { slug: string; updatedAt?: string | Date | null; createdAt?: string | Date | null }[] = [];
  let dynamicBlogs: { slug: string; updatedAt?: string | Date | null; createdAt?: string | Date | null }[] = [];

  try {
    const db = getDb();
    const [fetchedProjects, fetchedBlogs] = await Promise.all([
      db.select({
        slug: projects.slug,
        createdAt: projects.createdAt,
      }).from(projects),
      db.select({
        slug: blogPosts.slug,
        updatedAt: blogPosts.updatedAt,
        createdAt: blogPosts.createdAt,
      }).from(blogPosts).where(eq(blogPosts.published, true)),
    ]);
    dynamicProjects = fetchedProjects;
    dynamicBlogs = fetchedBlogs;
  } catch (err) {
    console.error("Failed to fetch dynamic records for sitemap:", err);
  }

  const formatDate = (dateValue?: string | Date | null): string => {
    if (!dateValue) return now;
    try {
      const d = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
      if (isNaN(d.getTime())) return now;
      return d.toISOString().split("T")[0];
    } catch {
      return now;
    }
  };

  const urlEntries = [
    ...staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`),
    ...dynamicProjects.map(proj => `
  <url>
    <loc>${baseUrl}/projects/${proj.slug}</loc>
    <lastmod>${formatDate(proj.createdAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`),
    ...dynamicBlogs.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${formatDate(post.updatedAt || post.createdAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
  ].join("");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  c.header("Content-Type", "application/xml; charset=utf-8");
  c.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return c.body(sitemapXml);
}
