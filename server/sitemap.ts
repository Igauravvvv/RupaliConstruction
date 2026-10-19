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

function formatDate(dateValue?: string | Date | null, fallbackDate?: string): string {
  const fallback = fallbackDate || new Date().toISOString().split("T")[0];
  if (!dateValue) return fallback;
  try {
    const d = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(d.getTime())) return fallback;
    return d.toISOString().split("T")[0];
  } catch {
    return fallback;
  }
}

export async function generateSitemapXml(): Promise<string> {
  const baseUrl = "https://rupaliconstruction.com";
  const today = new Date().toISOString().split("T")[0];

  // Core Static Routes & Service Landing Pages
  const staticRoutes: SitemapEntry[] = [
    {
      url: "",
      priority: "1.0",
      changefreq: "daily",
      lastmod: today,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction - AI-Powered Luxury Home Builders in Gurgaon",
    },
    {
      url: "/services",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      imageTitle: "Luxury Construction & Architectural Services in Gurgaon",
    },
    {
      url: "/services/residential-construction",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      imageTitle: "Luxury Residential & Turnkey Villa Construction Gurgaon",
    },
    {
      url: "/services/renovation",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
      imageTitle: "Structural Renovation & Villa Modernization Gurgaon",
    },
    {
      url: "/services/commercial-construction",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
      imageTitle: "Commercial & Corporate Construction Gurgaon",
    },
    {
      url: "/services/interior-design",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80",
      imageTitle: "Luxury Turnkey Interior Design Gurgaon",
    },
    {
      url: "/services/architectural-design",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
      imageTitle: "Architectural Design & Vastu Planning Gurgaon",
    },
    {
      url: "/services/structural-engineering",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1541888081691-1cb11354b670?auto=format&fit=crop&q=80",
      imageTitle: "Advanced Structural Engineering & Health Audits Gurgaon",
    },
    {
      url: "/projects",
      priority: "0.9",
      changefreq: "weekly",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
      imageTitle: "Delivered Luxury Villa & Commercial Projects Portfolio Gurgaon",
    },
    {
      url: "/blog",
      priority: "0.8",
      changefreq: "daily",
      lastmod: today,
      image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1920&q=80",
      imageTitle: "Construction Insights, Vastu Tips & Cost Guides Gurgaon",
    },
    {
      url: "/leadership",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: today,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction Leadership Team & Master Civil Engineers",
    },
    {
      url: "/brand-standards",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: today,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction Benchmark Brand & Raw Material Standards",
    },
    {
      url: "/contact",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: today,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Contact Rupali Construction - M3M Broadway Sector 71 Gurugram",
    },
    {
      url: "/sitemap",
      priority: "0.95",
      changefreq: "daily",
      lastmod: today,
      image: `${baseUrl}/logo-main.webp`,
      imageTitle: "Rupali Construction Complete Sitemap & Gurgaon Builder Directory",
    },
  ];

  // Base fallback projects
  const fallbackProjectsMap: Record<string, { title: string; image: string; date: string }> = {
    "quickin-stayz": {
      title: "QuickIn Stayz Commercial Hospitality Suites Gurgaon",
      image: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/f817e291-940c-43d3-a8af-b116265e6f2e.png",
      date: "2024-01-01",
    },
    "gold-gym": {
      title: "Gold Gym Commercial Fitness Landmark M3M Urbana Gurgaon",
      image: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/5416e429-298b-40a5-bd2b-cd8d4ce1c820.png",
      date: "2024-01-01",
    },
    "knowledge-center": {
      title: "Knowledge Center Corporate Innovation Suites M3M Broadway Gurgaon",
      image: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/7b1e9a0b-32c8-4e0b-9bbf-63b7b451ec68.png",
      date: "2024-01-01",
    },
    "duplex-luxury-villa": {
      title: "Duplex Luxury Villa The Westerlies Sector 108 Gurugram",
      image: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/a1d1885c-72d6-4bf5-9202-c8352529603d.jpg",
      date: "2024-01-01",
    },
    "apartment-at-sushant-lok": {
      title: "Apartment At Sushant Lok Luxury Residential Floor Gurgaon",
      image: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/9b0bd635-2175-4371-a8fc-50e7a50983db.png",
      date: "2024-01-01",
    },
  };

  // Base fallback blogs
  const fallbackBlogsMap: Record<string, { title: string; image: string; date: string }> = {
    "cost-of-building-house-gurgaon": {
      title: "Cost of Building a House in Gurgaon: Complete 2026 Guide",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
      date: "2026-06-15",
    },
    "gurgaon-real-estate-trends": {
      title: "Gurgaon Real Estate Trends 2026: Where to Invest in Residential Properties",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
      date: "2026-05-22",
    },
    "construction-timeline-breakdown": {
      title: "Construction Timeline Breakdown: From Blueprint to Handover in NCR",
      image: "https://images.unsplash.com/photo-1504307651254-35680f35aa2e?auto=format&fit=crop&q=80",
      date: "2026-04-10",
    },
    "building-approvals-gurugram": {
      title: "Navigating Building Approvals and Regulations in Gurugram (MCG/DTCP)",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80",
      date: "2026-03-05",
    },
    "top-residential-areas-gurgaon-villas": {
      title: "Top Residential Areas in Gurgaon for Custom Villa Construction",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
      date: "2026-02-18",
    },
    "sustainable-construction-gurgaon": {
      title: "Sustainable Construction Practices for the Gurgaon Climate",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80",
      date: "2026-01-30",
    },
    "luxury-smart-homes-gurgaon": {
      title: "The Rise of Luxury Smart Homes in Gurgaon's Real Estate Market",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80",
      date: "2025-12-10",
    },
    "rcc-vs-steel-structure": {
      title: "RCC vs Steel Structure: Which is Better for Your NCR Project?",
      image: "https://images.unsplash.com/photo-1541888081691-1cb11354b670?auto=format&fit=crop&q=80",
      date: "2025-11-22",
    },
  };

  const projectEntriesMap = new Map<string, SitemapEntry>();
  // Populate fallback projects
  for (const [slug, item] of Object.entries(fallbackProjectsMap)) {
    projectEntriesMap.set(slug, {
      url: `/projects/${slug}`,
      priority: "0.8",
      changefreq: "monthly",
      lastmod: item.date,
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
        lastmod: formatDate(proj.createdAt, today),
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
        lastmod: formatDate(blog.updatedAt || blog.createdAt, today),
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
    <loc>${loc}</loc>
    <lastmod>${entry.lastmod || today}</lastmod>
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
