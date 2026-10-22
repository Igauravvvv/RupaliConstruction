import { publicProjectFields } from "./queries/project-fields.js";
import { cachedPublicContent } from "./public-content-cache.js";
import { getServiceBySlug } from "../src/data/servicesData.js";
import { homeHtml } from "../shared/home-html.js";
import { buildingGuide } from "../shared/building-guide.js";
import { fallbackPosts } from "../shared/blog-content.js";
import { fallbackProjects } from "../shared/project-content.js";
import { business, homeSeo, localBusinessSchema, localFaqSchema } from "../shared/local-seo.js";
import type { Context } from "hono";
import fs from "fs";
import path from "path";
import { getDb } from "./queries/connection.js";
import { projects, blogPosts } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

interface PageData {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  jsonLd: Record<string, any> | Array<Record<string, any>>;
  semanticHtml: string;
  status?: 404 | 503;
}

const BASE_URL = "https://rupaliconstruction.com";
const DEFAULT_IMAGE = `${BASE_URL}/logo-main.webp`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let cachedTemplate: string | null = null;
let lastTemplateLoad = 0;

function getHtmlTemplate(): string {
  const now = Date.now();
  if (cachedTemplate && now - lastTemplateLoad < 30000) {
    return cachedTemplate;
  }
  const possiblePaths = [
    path.resolve(process.cwd(), "dist", "index.html"),
    path.resolve(process.cwd(), "dist", "public", "index.html"),
    path.resolve(import.meta.dirname, "../dist/index.html"),
    path.resolve(import.meta.dirname, "../../dist/index.html"),
    path.resolve(process.cwd(), "index.html"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        cachedTemplate = fs.readFileSync(p, "utf-8");
        lastTemplateLoad = now;
        return cachedTemplate;
      } catch {
        // Ignore read errors and try next path
      }
    }
  }

  // Fallback structural template if no file is readable
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" /><link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" /><link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" /><link rel="shortcut icon" href="/favicon.ico" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Rupali Construction | Crafting Architecture into Reality</title><meta name="description" content="Rupali Construction is a premium Gurgaon-based company specializing in residential construction, luxury villas, real estate resale, and architectural design." /><link rel="canonical" href="${BASE_URL}/" /></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`;
}

function getDefaultJsonLd(pageDescription?: string): Array<Record<string, any>> {
  const desc = pageDescription || "At Rupali Construction, we provide turnkey home construction and architectural solutions with licensed structural engineers, quality material sourcing, and detailed 2D/3D Vastu designs in Gurgaon and Delhi NCR.";
  return [
    localBusinessSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "name": "Rupali Construction",
      "alternateName": "Rupali Homes",
      "url": BASE_URL,
      "description": desc,
      "publisher": {
        "@id": `${BASE_URL}/#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "@id": `${BASE_URL}/#sitelinks`,
      "name": [
        "Rupali Construction Ongoing Projects",
        "House Construction, Gurugram & NCR",
        "Best House Construction Quality & Standards",
        "Best Luxury Construction Studio In Gurgaon"
      ],
      "url": [
        `${BASE_URL}/projects`,
        `${BASE_URL}/services`,
        `${BASE_URL}/brand-standards`,
        `${BASE_URL}/contact`
      ]
    }
  ];
}

function missingPage(pathname: string, status: 404 | 503 = 404): PageData {
  return { title: status === 404 ? "Page Not Found | Rupali Construction" : "Temporarily Unavailable | Rupali Construction",
    description: "Browse Rupali Construction services and projects in Gurgaon.", canonical: `${BASE_URL}${pathname}`,
    ogImage: DEFAULT_IMAGE, jsonLd: [], status,
    semanticHtml: `<main class="seo-prerender-container"><h1>${status === 404 ? "Page not found" : "Temporarily unavailable"}</h1><p>Please browse our <a href="/services">services</a> or <a href="/">return home</a>.</p></main>` };
}

async function resolvePageData(pathname: string): Promise<PageData> {
  const cleanPath = pathname.replace(/\/$/, "") || "/";

  // Default homepage & General SEO fallback
  if (cleanPath === "/" || cleanPath === "/home") {
    return {
      title: homeSeo.title,
      description: homeSeo.description,
      canonical: `${BASE_URL}/`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: [...getDefaultJsonLd(), localFaqSchema],
      semanticHtml: homeHtml(),
    };
  }

  if (cleanPath === buildingGuide.path) {
    return {
      title: buildingGuide.title, description: buildingGuide.description,
      canonical: `${BASE_URL}${buildingGuide.path}`, ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd(),
      semanticHtml: `<main class="seo-prerender-container" style="padding:2rem;max-width:900px;margin:auto;font-family:sans-serif;line-height:1.7">
        <nav><a href="/">Home</a> / Building guide</nav><h1>${escapeHtml(buildingGuide.heading)}</h1><p>${escapeHtml(buildingGuide.intro)}</p>
        ${buildingGuide.sections.map(section => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.text)}</p></section>`).join("")}
        <nav><a href="/services/residential-construction">Home construction services</a> | <a href="/projects">Project portfolio</a> | <a href="/brand-standards">Material standards</a> | <a href="/contact">Request a construction consultation</a></nav>
      </main>`,
    };
  }

  if (cleanPath === "/services") {
    return {
      title: "Construction & Contractor Services in Gurgaon | Rupali Construction",
      description: "Rupali Construction is a leading construction company in Gurgaon delivering turnkey luxury villas, structural architecture, and Vastu-compliant floor designs.",
      canonical: `${BASE_URL}/services`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Expert residential construction, turnkey interior architectural execution, and property real estate development in Gurgaon."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1200px; margin: 0 auto;">
          <h1>Our Construction & Architectural Services</h1>
          <article style="margin-top: 1.5rem;">
            <h2>1. Residential Villa & Home Construction</h2>
            <p>Complete structural builds from excavation to final paint, engineered with high-strength seismic reinforcement and energy-efficient insulation across Gurgaon.</p>
          </article>
          <article style="margin-top: 1.5rem;">
            <h2>2. Turnkey Commercial Architecture</h2>
            <p>Specialty workspaces, corporate executive lounges, high-load industrial installations, and institutional structural builds delivered on rigorous timelines.</p>
          </article>
          <article style="margin-top: 1.5rem;">
            <h2>3. Vastu Shastra & Architectural Blueprint Consulting</h2>
            <p>Rigorous structural space planning that fuses modern biometric energy circulation models with foundational principles of classical Vastu orientation.</p>
          </article>
          <article style="margin-top: 1.5rem;">
            <h2>4. Real Estate Resale & Asset Strategy</h2>
            <p>Advisory and valuation services for prime Gurgaon residential plots and turnkey luxury estates.</p>
          </article>
          <div style="margin-top: 2rem;"><a href="/contact">Schedule a Consultation</a></div>
        </main>
      `,
    };
  }

  if (cleanPath.startsWith("/services/")) {
    const serviceSlug = cleanPath.replace("/services/", "").toLowerCase().trim();
    const service = getServiceBySlug(serviceSlug);
    if (!service) return missingPage(cleanPath);
    const info = { title: `${service.shortTitle} in Gurgaon | Rupali Construction`, desc: `${service.shortTitle} services in Gurgaon (Gurugram). Discuss your project scope, material specifications and construction requirements with Rupali Construction.` };

    return {
      title: info.title,
      description: info.desc,
      canonical: `${BASE_URL}/services/${serviceSlug}`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: [...getDefaultJsonLd(info.desc), {
        "@context": "https://schema.org", "@type": "Service", name: service.title,
        serviceType: service.shortTitle, url: `${BASE_URL}/services/${service.slug}`,
        provider: { "@id": localBusinessSchema["@id"] }, areaServed: { "@type": "City", name: "Gurugram", alternateName: "Gurgaon" },
      }],
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1200px; margin: 0 auto;">
          <h1>${info.title}</h1>
          <p>${info.desc}</p>
          <h2>Our construction process</h2><ol>${service.steps.map(step => `<li><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.desc)}</p></li>`).join("")}</ol>
          <h2>Questions about ${escapeHtml(service.shortTitle)}</h2>${service.faqs.map(faq => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join("")}
          <nav><a href="/projects">Project portfolio</a> | <a href="/building-guide-gurgaon">Compare builders and contractors</a> | <a href="/contact">Book a Consultation Call</a></nav>
        </main>
      `,
    };
  }

  if (cleanPath === "/projects") {
    let projectsHtml = fallbackProjects.map(p => `<article><h2><a href="/projects/${escapeHtml(p.slug)}">${escapeHtml(p.name)}</a></h2><p>${escapeHtml(p.description)}</p></article>`).join("");
    try {
      const db = getDb();
      const latestProjects = await db.select(publicProjectFields).from(projects).orderBy(desc(projects.createdAt)).limit(12);
      if (latestProjects.length > 0) {
        projectsHtml = latestProjects.map(p => `
          <div style="margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
            <h2><a href="/projects/${escapeHtml(p.slug)}">${escapeHtml(p.name)}</a></h2>
            <p><strong>Location:</strong> ${escapeHtml(p.location || "Gurugram, Haryana")} | <strong>Type:</strong> ${escapeHtml(p.type)} | <strong>Status:</strong> ${escapeHtml(p.status)}</p>
            <p>${escapeHtml((p.description || "").substring(0, 250))}...</p>
            <a href="/projects/${escapeHtml(p.slug)}">View Full Specification & Gallery →</a>
          </div>
        `).join("");
      }
    } catch (err) {
      console.error("Error fetching projects for prerender:", err);
    }

    return {
      title: "Rupali Construction Ongoing Projects | Best Home Builders",
      description: "Rupali Construction has built completed and ongoing luxury residential villas, corporate spaces, and architectural landmarks across Gurgaon and Delhi NCR.",
      canonical: `${BASE_URL}/projects`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Portfolio of turnkey residential villas and commercial installations engineered by Rupali Construction in Gurugram."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1200px; margin: 0 auto;">
          <h1>Featured Construction Projects & Architectural Gallery</h1>
          <p>Discover our uncompromising structural standards and award-winning spatial design across Gurugram.</p>
          <section style="margin-top: 2rem;">
            ${projectsHtml}
          </section>
        </main>
      `,
    };
  }

  if (cleanPath.startsWith("/projects/")) {
    const slug = cleanPath.replace("/projects/", "");
    let proj: (typeof fallbackProjects)[number] & {status?: string; cost?: string | null} | Omit<typeof projects.$inferSelect, "cost"> | undefined = fallbackProjects.find(item => item.slug === slug);
    let queryFailed = false;
    try {
      const [record] = await getDb().select(publicProjectFields).from(projects).where(eq(projects.slug, slug)).limit(1);
      proj = record || proj;
    } catch { queryFailed = true; }
    if (proj) {

        const title = `${proj.name} | Luxury Architecture in ${proj.location || "Gurugram"} by Rupali Construction`;
        const description = (proj.description || `Explore ${proj.name}, a turnkey ${proj.type} architectural masterpiece built by Rupali Construction in ${proj.location || "Gurugram"}.`).substring(0, 300);
        let imageUrl = DEFAULT_IMAGE;
        try {
          if (proj.images) {
            const parsed = JSON.parse(proj.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageUrl = parsed[0].startsWith("http") ? parsed[0] : `${BASE_URL}${parsed[0].startsWith("/") ? "" : "/"}${parsed[0]}`;
            }
          }
        } catch {
          // Ignore json parse error for image fallback
        }

        const jsonLd = {
          "@context": "https://schema.org", "@type": "CreativeWork",
          name: proj.name, image: imageUrl, description,
          url: `${BASE_URL}/projects/${proj.slug}`,
          creator: { "@id": localBusinessSchema["@id"] },
        };

        return {
          title,
          description,
          canonical: `${BASE_URL}/projects/${proj.slug}`,
          ogImage: imageUrl,
          jsonLd,
          semanticHtml: `
            <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1000px; margin: 0 auto;">
              <nav><a href="/projects">← Back to All Projects</a></nav>
              <h1 style="font-size: 2.2rem; margin-top: 1rem;">${escapeHtml(proj.name)}</h1>
              <div style="color: #666; margin-bottom: 1.5rem;">
                <span><strong>Location:</strong> ${escapeHtml(proj.location || "Gurgaon, NCR")}</span> |
                <span><strong>Type:</strong> ${escapeHtml(proj.type.toUpperCase())}</span> |
                <span><strong>Status:</strong> ${escapeHtml((proj.status || "completed").toUpperCase())}</span> |
                <span><strong>Built Area:</strong> ${escapeHtml(proj.area || "Custom Plan")}</span>
              </div>
              <article style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
                <p>${escapeHtml(proj.description || "Project specifications under final processing.")}</p>
              </article>
              ${proj.completionDate ? `<p><strong>Delivery Milestone:</strong> ${escapeHtml(proj.completionDate)}</p>` : ""}
              <footer style="margin-top: 3rem; background: #f9f9f9; padding: 1.5rem; border-radius: 8px;">
                <h3>Interested in building a residence like ${escapeHtml(proj.name)}?</h3>
                <p>Contact our structural engineers and Vastu specialists for an initial plot architectural consult.</p>
                <a href="/contact">Request Project Cost Estimate →</a>
              </footer>
            </main>
          `,
        };
    }
    return missingPage(cleanPath, queryFailed ? 503 : 404);
  }

  if (cleanPath === "/blog") {
    let blogsHtml = fallbackPosts.map(p => `<article><h2><a href="/blog/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt)}</p></article>`).join("");
    try {
      const db = getDb();
      const latestBlogs = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt)).limit(15);
      if (latestBlogs.length > 0) {
        blogsHtml = latestBlogs.map(b => `
          <article style="margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
            <h2><a href="/blog/${escapeHtml(b.slug)}">${escapeHtml(b.title)}</a></h2>
            <p style="color: #777; font-size: 0.9rem;">By ${escapeHtml(b.author || "Rupali Editorial")} | Category: ${escapeHtml(b.category || "Architecture")}</p>
            <p>${escapeHtml((b.excerpt || b.content || "").substring(0, 240))}...</p>
            <a href="/blog/${escapeHtml(b.slug)}">Read Full Guide →</a>
          </article>
        `).join("");
      }
    } catch (err) {
      console.error("Error fetching blogs for prerender:", err);
    }

    return {
      title: "Construction Insights, Vastu Guides & Architectural Blog | Rupali Construction",
      description: "Read authoritative engineering articles, luxury construction cost breakdowns, architectural trends, and Vastu Shastra guides authored by Rupali Construction's design studio.",
      canonical: `${BASE_URL}/blog`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Engineering and architectural construction blog by Rupali Homes in Gurugram."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1100px; margin: 0 auto;">
          <h1>Rupali Construction Engineering & Architectural Blog</h1>
          <p>Professional guides on building codes, RCC framework durability, Vastu orientation, and cost estimation in Gurgaon.</p>
          <section style="margin-top: 2rem;">
            ${blogsHtml}
          </section>
        </main>
      `,
    };
  }

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");
    let post: (typeof fallbackPosts)[number] & {updatedAt?: Date | string | null} | typeof blogPosts.$inferSelect | undefined = fallbackPosts.find(item => item.slug === slug);
    let queryFailed = false;
    try {
      const [record] = await getDb().select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
      if (record && !record.published) return missingPage(cleanPath);
      post = record || post;
    } catch { queryFailed = true; }
    if (post) {

        const title = `${post.title} | Rupali Construction Blog`;
        const description = (post.excerpt || post.content || "").substring(0, 280);
        const imageUrl = post.coverImage ? (post.coverImage.startsWith("http") ? post.coverImage : `${BASE_URL}${post.coverImage.startsWith("/") ? "" : "/"}${post.coverImage}`) : DEFAULT_IMAGE;

        const jsonLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "image": imageUrl,
          "author": {
            "@type": "Person",
            "name": post.author || "Rupali Construction Studio",
          },
          "publisher": {
            "@type": "Organization",
            "name": "Rupali Construction",
            "logo": {
              "@type": "ImageObject",
              "url": DEFAULT_IMAGE,
            },
          },
          "datePublished": post.createdAt instanceof Date ? post.createdAt.toISOString() : (post.createdAt || new Date().toISOString()),
          "dateModified": post.updatedAt instanceof Date ? post.updatedAt.toISOString() : (post.updatedAt || new Date().toISOString()),
          "description": description,
        };

        return {
          title,
          description,
          canonical: `${BASE_URL}/blog/${post.slug}`,
          ogImage: imageUrl,
          jsonLd,
          semanticHtml: `
            <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 850px; margin: 0 auto;">
              <nav><a href="/blog">← Back to Blog Articles</a></nav>
              <article style="margin-top: 1.5rem;">
                <h1 style="font-size: 2.4rem; line-height: 1.3;">${escapeHtml(post.title)}</h1>
                <p style="color: #777; margin-bottom: 2rem;">By <strong>${escapeHtml(post.author || "Rupali Team")}</strong> in <em>${escapeHtml(post.category || "General Architecture")}</em></p>
                <div style="font-size: 1.15rem; line-height: 1.9; white-space: pre-wrap; color: #222;">
                  ${escapeHtml(post.content)}
                </div>
              </article>
              <footer style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #ccc;">
                <h3>Discuss your construction plans with our engineering studio</h3>
                <a href="/contact">Contact Rupali Construction →</a>
              </footer>
            </main>
          `,
        };
    }
    return missingPage(cleanPath, queryFailed ? 503 : 404);
  }

  if (cleanPath === "/leadership") {
    return {
      title: "Leadership & Executive Architectural Studio | Rupali Construction",
      description: "Meet the seasoned civil engineers, master architects, and project directors behind Rupali Construction's acclaimed developments in Gurgaon.",
      canonical: `${BASE_URL}/leadership`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Executive leadership profiles at Rupali Construction."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1100px; margin: 0 auto;">
          <h1>Our Leadership & Executive Engineering Team</h1>
          <p>Led by seasoned civil construction executives and innovative space architects, Rupali Homes operates on principles of extreme structural rigor and aesthetic distinction.</p>
          <section style="margin-top: 2rem;">
            <h2>Vision & Governance</h2>
            <p>Our executive commitment is centered on delivering Grade-A RCC structural safety, absolute material auditing, and reliable milestone-driven handovers without timeline variances.</p>
          </section>
        </main>
      `,
    };
  }

  if (cleanPath === "/brand-standards") {
    return {
      title: "Best House Construction Quality & Standards | Rupali Construction",
      description: "Uncompromising Grade Fe500D TATA steel reinforcement, UltraTech M30 concrete, and imported crystallization waterproofing specified for every Rupali residence.",
      canonical: `${BASE_URL}/brand-standards`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Quality standards and structural engineering protocols at Rupali Construction."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1100px; margin: 0 auto;">
          <h1>Uncompromising Brand Standards & Engineering Specifications</h1>
          <section style="margin-top: 2rem;">
            <h2>1. Structural Integrity & Reinforcement</h2>
            <p>We mandate Grade Fe500D TATA / JSW primary steel reinforcement across all load-bearing footings, pillars, and structural roof slabs, paired exclusively with automated testing of UltraTech M25/M30 ready-mix concrete.</p>
          </section>
          <section style="margin-top: 1.5rem;">
            <h2>2. Advanced Waterproofing & Dampproofing</h2>
            <p>Multi-stage Dr. Fixit / Fosroc crystalizing waterproofing applications across foundation grade slabs, bathroom sunken floors, and exposed exterior roof terracing.</p>
          </section>
        </main>
      `,
    };
  }

  if (cleanPath === "/contact") {
    return {
      title: "Contact Rupali Construction | Builder & Contractor in Gurgaon",
      description: "Contact Rupali Construction at M3M Broadway, Sector 71, Gurugram. Discuss home construction, contracting and interiors, or get directions on Google Maps.",
      canonical: `${BASE_URL}/contact`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Contact information and Gurugram headquarters for Rupali Construction."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1000px; margin: 0 auto;">
          <h1>Contact Our Architectural & Construction Studio</h1>
          <p>Schedule an in-person meeting at our corporate headquarters or book a virtual Vastu & architectural appraisal.</p>
          <address style="font-style: normal; margin-top: 2rem; line-height: 1.8; background: #f4f4f4; padding: 1.5rem; border-radius: 8px;">
            <p><strong>Corporate Headquarters:</strong> 5th floor, M3M Broadway, Sector 71, Gurugram, Haryana 122001</p>
            <p><strong>Phone Consultation:</strong> <a href="tel:+919311830088">+91 93118 30088</a></p>
            <p><strong>Email Address:</strong> <a href="mailto:ujjwalt.rg@rupalihomes.com">ujjwalt.rg@rupalihomes.com</a></p>
            <p><strong>Working Hours:</strong> Every day, 10:00 AM – 7:00 PM IST</p>
          </address>
          <p><a href="${business.mapsUrl}">Rupali Construction on Google Maps</a> | <a href="${business.directionsUrl}">Get directions</a></p>
        </main>
      `,
    };
  }

  if (cleanPath === "/sitemap" || cleanPath === "/site-map") {
    return { title: "Sitemap | Rupali Construction", description: "Find construction services, projects, building guides and contact details for Rupali Construction in Gurgaon.",
      canonical: `${BASE_URL}/sitemap`, ogImage: DEFAULT_IMAGE, jsonLd: getDefaultJsonLd(),
      semanticHtml: `<main class="seo-prerender-container"><h1>Rupali Construction sitemap</h1>
        <nav><a href="/">Home</a> | <a href="/services">Services</a> | <a href="/projects">Projects</a> | <a href="/blog">Blog</a> | <a href="/building-guide-gurgaon">Choosing a builder in Gurgaon</a> | <a href="/brand-standards">Material standards</a> | <a href="/leadership">Leadership</a> | <a href="/contact">Contact and Google Maps</a></nav>
        <h2>Construction guides</h2><ul>${fallbackPosts.map(p => `<li><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></li>`).join("")}</ul>
        <h2>Project portfolio</h2><ul>${fallbackProjects.map(p => `<li><a href="/projects/${p.slug}">${escapeHtml(p.name)}</a></li>`).join("")}</ul></main>`,
    };
  }

  const privateRoute = /^\/(admin|admin-login|login|profile|complete-profile)(?:\/|$)/.test(cleanPath);
  return {
    title: privateRoute ? "Account | Rupali Construction" : "Page Not Found | Rupali Construction",
    description: "Browse Rupali Construction services, projects and contact information.",
    canonical: `${BASE_URL}${cleanPath}`, ogImage: DEFAULT_IMAGE,
    jsonLd: [], status: privateRoute ? undefined : 404,
    semanticHtml: '<main class="seo-prerender-container"><h1>Page not found</h1><p>This page does not exist.</p><a href="/">Home</a> | <a href="/services">Services</a></main>',
  };
}

export async function seoPrerenderHandler(c: Context) {
  try {
    const url = new URL(c.req.url);
    if (url.pathname.startsWith("/services/")) {
      const service = getServiceBySlug(url.pathname.split("/")[2]);
      if (service && url.pathname !== `/services/${service.slug}`) return c.redirect(`/services/${service.slug}`, 301);
    }
    const privatePage = /^\/(admin|admin-login|login|profile|complete-profile)(?:\/|$)/.test(url.pathname);
    const pageData = privatePage ? await resolvePageData(url.pathname)
      : await cachedPublicContent(`page:${url.pathname}`, () => resolvePageData(url.pathname));
    let html = getHtmlTemplate();
    // The static homepage is also the server template for all other routes.
    html = html.replace(/<script\b[^>]*data-seo-static=["']true["'][^>]*>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<!--seo-content-start-->[\s\S]*?<!--seo-content-end-->/, "");
    if (pageData.status) c.status(pageData.status);

    // Replace Title
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(pageData.title)}</title>`);
    if (!/<title>/i.test(html)) {
      html = html.replace("</head>", `<title>${escapeHtml(pageData.title)}</title>\n</head>`);
    }

    // Replace Description & Meta tags
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(pageData.description)}" />`);
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${pageData.canonical}" />`);

    const isPrivateAppRoute = url.pathname.startsWith('/admin') || url.pathname.startsWith('/profile') || url.pathname.startsWith('/login') || url.pathname.startsWith('/complete-profile');

    const robotsMeta = (isPrivateAppRoute || pageData.status)
      ? `<meta name="robots" content="noindex, nofollow" />\n    <meta name="googlebot" content="noindex, nofollow" />`
      : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />\n    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`;

    const geoMeta = isPrivateAppRoute ? "" : `
    <meta name="geo.region" content="IN-HR" />
    <meta name="geo.placename" content="Gurugram" />
    <meta name="geo.position" content="${business.latitude};${business.longitude}" />
    <meta name="ICBM" content="${business.latitude}, ${business.longitude}" />`;

    html = html.replace(/<meta\b[^>]*(?:name|property)=["'](?:og:[^"']+|twitter:[^"']+|robots|googlebot|geo\.[^"']+|ICBM)["'][^>]*>/gi, "");
    html = html.replace(/<link\b[^>]*rel=["']sitemap["'][^>]*>/gi, "");

    // Inject OpenGraph & Twitter tags and JSON-LD schema into head
    const schemaScript = (isPrivateAppRoute || pageData.status) ? "" : Array.isArray(pageData.jsonLd)
      ? pageData.jsonLd.map(s => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, "\\u003c")}</script>`).join("\n")
      : `<script type="application/ld+json">${JSON.stringify(pageData.jsonLd).replace(/</g, "\\u003c")}</script>`;

    const ogTags = `
    <link rel="sitemap" type="application/xml" title="Sitemap" href="${BASE_URL}/sitemap.xml" />
    ${robotsMeta}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Rupali Construction" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${pageData.canonical}" />
    <meta property="og:title" content="${escapeHtml(pageData.title)}" />
    <meta property="og:description" content="${escapeHtml(pageData.description)}" />
    <meta property="og:image" content="${pageData.ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@rupalihomes" />
    <meta name="twitter:creator" content="@rupalihomes" />
    <meta name="twitter:url" content="${pageData.canonical}" />
    <meta name="twitter:title" content="${escapeHtml(pageData.title)}" />
    <meta name="twitter:description" content="${escapeHtml(pageData.description)}" />
    <meta name="twitter:image" content="${pageData.ogImage}" />${geoMeta}
    ${schemaScript}
    `;

    html = html.replace("</head>", `${ogTags}\n</head>`);

    // Inject Semantic Content directly into root container for AI bots and immediate FCP
    if (!isPrivateAppRoute) {
      html = html.replace(/<div id=["']root["']>\s*<\/div>/i, `<div id="root">${pageData.semanticHtml}</div>`);
    }

    c.header("Content-Type", "text/html; charset=utf-8");
    c.header("Cache-Control", (isPrivateAppRoute || pageData.status) ? "private, no-store" : "public, max-age=30, s-maxage=300, stale-while-revalidate=3600");
    return c.body(html);
  } catch (err) {
    console.error("Error in seoPrerenderHandler:", err);
    // Fallback to plain html on unexpected exception
    c.header("Content-Type", "text/html; charset=utf-8");
    return c.body(getHtmlTemplate());
  }
}
