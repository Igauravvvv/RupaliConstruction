import { fallbackPosts } from "../shared/blog-content.js";
import { fallbackProjects } from "../shared/project-content.js";
import { buildingGuide } from "../shared/building-guide.js";
import type { Context } from "hono";
import { getDb } from "./queries/connection.js";
import { projects, blogPosts } from "../db/schema.js";
import { eq } from "drizzle-orm";

interface SitemapEntry {
  url: string;
  priority: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastmod?: string;
  image?: string;
  imageTitle?: string;
}

function escapeXml(unsafe?: string | null): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}

function formatDate(dateValue?: string | Date | null): string | undefined {
  if (!dateValue) return undefined;
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().split("T")[0];
}

export async function generateSitemapXml(): Promise<string> {
  const baseUrl = "https://rupaliconstruction.com";
  const staticModified = "2026-10-22";

  // Core Static Routes & Service Landing Pages
  const staticRoutes: SitemapEntry[] = [
    {
      url: "/",
      priority: "1.0",
      changefreq: "daily",
      lastmod: staticModified,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction - Builder and Contractor in Gurgaon",
    },
    {
      url: "/services",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      imageTitle: "Luxury Construction & Architectural Services in Gurgaon",
    },
    {
      url: "/services/residential-construction",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      imageTitle: "Luxury Residential & Turnkey Villa Construction Gurgaon",
    },
    {
      url: "/services/renovation",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
      imageTitle: "Structural Renovation & Villa Modernization Gurgaon",
    },
    {
      url: "/services/commercial-construction",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      imageTitle: "Commercial & Corporate Construction Gurgaon",
    },
    {
      url: "/services/interior-design",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
      imageTitle: "Luxury Turnkey Interior Design Gurgaon",
    },
    {
      url: "/services/architectural-design",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
      imageTitle: "Architectural Design & Vastu Planning Gurgaon",
    },
    {
      url: "/services/structural-engineering",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1541888081691-1cb11354b670?auto=format&fit=crop&q=80",
      imageTitle: "Advanced Structural Engineering & Health Audits Gurgaon",
    },
    {
      url: "/projects",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      imageTitle: "Delivered Luxury Villa & Commercial Projects Portfolio Gurgaon",
    },
    {
      url: "/blog",
      priority: "0.8",
      changefreq: "daily",
      lastmod: staticModified,
      image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1920&q=80",
      imageTitle: "Construction Insights, Vastu Tips & Cost Guides Gurgaon",
    },
    {
      url: "/leadership",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: staticModified,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction Leadership Team & Master Civil Engineers",
    },
    {
      url: "/brand-standards",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: staticModified,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction Benchmark Brand & Raw Material Standards",
    },
    {
      url: "/contact",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: staticModified,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Contact Rupali Construction - M3M Broadway Sector 71 Gurugram",
    },
    {
      url: "/sitemap",
      priority: "0.95",
      changefreq: "daily",
      lastmod: staticModified,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction Complete Sitemap & Gurgaon Builder Directory",
    },
  ];

  staticRoutes.push({ url: buildingGuide.path, priority: "0.8", changefreq: "monthly", lastmod: staticModified });
  const fallbackProjectsMap = Object.fromEntries(fallbackProjects.map(project => [project.slug, {
    title: project.name, image: project.coverImage,
  }]));
  const fallbackBlogsMap = Object.fromEntries(fallbackPosts.map(post => [post.slug, {
    title: post.title, image: post.coverImage, date: formatDate(post.createdAt),
  }]));

  const projectEntriesMap = new Map<string, SitemapEntry>();
  // Populate fallback projects
  for (const [slug, item] of Object.entries(fallbackProjectsMap)) {
    projectEntriesMap.set(slug, {
      url: `/projects/${slug}`,
      priority: "0.8",
      changefreq: "monthly",
      image: item.image,
      imageTitle: item.title,
    });
  }

  const blogEntriesMap = new Map<string, SitemapEntry>();
  // Populate fallback blogs
  for (const [slug, item] of Object.entries(fallbackBlogsMap)) {
    blogEntriesMap.set(slug, {
      url: `/blog/${slug}`,
      priority: "0.7",
      changefreq: "weekly",
      lastmod: item.date,
      image: item.image,
      imageTitle: item.title,
    });
  }

  // Fetch dynamic items from database if available
  try {
    const db = getDb();
    const [fetchedProjects, fetchedBlogs] = await Promise.all([
      db.select({
        slug: projects.slug,
        name: projects.name,
        images: projects.images,
        createdAt: projects.createdAt,
      }).from(projects),
      db.select({
        slug: blogPosts.slug,
        title: blogPosts.title,
        coverImage: blogPosts.coverImage,
        updatedAt: blogPosts.updatedAt,
        createdAt: blogPosts.createdAt,
      }).from(blogPosts).where(eq(blogPosts.published, true)),
    ]);

    for (const proj of fetchedProjects) {
      if (!proj.slug) continue;
      const cleanSlug = proj.slug.trim().toLowerCase();
      let firstImage: string | undefined;
      if (proj.images) {
        try {
          const parsed = JSON.parse(proj.images);
          if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
            firstImage = parsed[0];
          }
        } catch {
          if (proj.images.startsWith("http")) {
            firstImage = proj.images;
          }
        }
      }

      projectEntriesMap.set(cleanSlug, {
        url: `/projects/${cleanSlug}`,
        priority: "0.8",
        changefreq: "monthly",
        lastmod: proj.createdAt ? formatDate(proj.createdAt) : undefined,
        image: firstImage || fallbackProjectsMap[cleanSlug]?.image || `${baseUrl}/logo-main.webp`,
        imageTitle: proj.name || fallbackProjectsMap[cleanSlug]?.title || "Luxury Project Gurgaon",
      });
    }

    for (const blog of fetchedBlogs) {
      if (!blog.slug) continue;
      const cleanSlug = blog.slug.trim().toLowerCase();
      blogEntriesMap.set(cleanSlug, {
        url: `/blog/${cleanSlug}`,
        priority: "0.7",
        changefreq: "weekly",
        lastmod: blog.updatedAt || blog.createdAt ? formatDate(blog.updatedAt || blog.createdAt) : undefined,
        image: blog.coverImage || fallbackBlogsMap[cleanSlug]?.image || `${baseUrl}/logo-main.webp`,
        imageTitle: blog.title || fallbackBlogsMap[cleanSlug]?.title || "Construction Insight Gurgaon",
      });
    }
  } catch (err) {
    console.error("Failed to fetch dynamic records from DB for sitemap, using resilient fallbacks:", err);
  }

  const allEntries: SitemapEntry[] = [
    ...staticRoutes,
    ...Array.from(projectEntriesMap.values()),
    ...Array.from(blogEntriesMap.values()),
  ];

  const xmlUrls = allEntries.map((entry) => {
    const loc = `${baseUrl}${entry.url}`;
    const imageTag = entry.image
      ? `
    <image:image>
      <image:loc>${escapeXml(entry.image)}</image:loc>
      <image:title>${escapeXml(entry.imageTitle || "Rupali Construction")}</image:title>
    </image:image>`
      : "";

    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${imageTag}
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlUrls}
</urlset>`;
}

export async function sitemapHandler(c: Context) {
  try {
    const sitemapXml = await generateSitemapXml();
    c.header("Content-Type", "application/xml; charset=utf-8");
    c.header("Cache-Control", "public, max-age=3600, s-maxage=3600");
    return c.body(sitemapXml);
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return c.text("Error generating sitemap", 500);
  }
}
