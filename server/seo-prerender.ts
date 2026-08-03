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
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Rupali Construction | Crafting Architecture into Reality</title><meta name="description" content="Rupali Construction is a premium Gurgaon-based company specializing in residential construction, luxury villas, real estate resale, and architectural design." /><link rel="canonical" href="${BASE_URL}/" /></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`;
}

function getDefaultJsonLd(pageDescription?: string): Array<Record<string, any>> {
  return [
    {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      "name": "Rupali Construction",
      "alternateName": "Rupali Homes",
      "url": BASE_URL,
      "logo": DEFAULT_IMAGE,
      "image": DEFAULT_IMAGE,
      "description": pageDescription || "Rupali Construction is a premium Gurgaon-based contractor specializing in luxury residential villas, commercial building, structural design, and turnkey interiors.",
      "telephone": "+919311830088",
      "email": "ujjwalt.rg@rupalihomes.com",
      "priceRange": "$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "5th floor, M3M Broadway, Sector 71",
        "addressLocality": "Gurugram",
        "addressRegion": "Haryana",
        "postalCode": "122004",
        "addressCountry": "IN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.3971,
        "longitude": 77.0370,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Rupali Construction",
      "url": BASE_URL,
    },
  ];
}

async function resolvePageData(pathname: string): Promise<PageData> {
  const cleanPath = pathname.replace(/\/$/, "") || "/";

  // Default homepage & General SEO fallback
  if (cleanPath === "/" || cleanPath === "/home") {
    return {
      title: "Rupali Construction | Crafting Architecture into Reality in Gurgaon",
      description: "Rupali Construction is Gurgaon's premier construction and architectural contracting company specializing in luxury residential villas, turnkey interiors, commercial building, and real estate consulting.",
      canonical: BASE_URL,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd(),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto;">
          <header>
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Rupali Construction | Premier Architectural Contractor in Gurugram</h1>
            <p style="font-size: 1.2rem; color: #555;">Crafting Luxury Residences, Turnkey Commercial Spaces, and Bespoke Villas across Gurgaon & Delhi NCR since foundation.</p>
          </header>
          <section style="margin-top: 2rem;">
            <h2>Our Core Engineering & Construction Services</h2>
            <ul>
              <li><strong>Luxury Residential Villas:</strong> Custom architectural design, Grade-A structural engineering, earthquake resistance, and premium finishing.</li>
              <li><strong>Turnkey Interiors & Execution:</strong> Complete bespoke interior transformations with Italian marble, custom carpentry, modular kitchens, and HVAC integration.</li>
              <li><strong>Commercial Building Construction:</strong> High-efficiency corporate spaces, retail complex construction, and compliant fire & safety designs.</li>
              <li><strong>Vastu Shastra & Architectural Consulting:</strong> Harmonized spatial floor plans optimized for natural lighting, structural longevity, and positive energy flow.</li>
              <li><strong>Real Estate Resale & Development:</strong> Verified luxury property consulting across prime Gurugram sectors including Sector 71, Golf Course Extension, and Southern Peripheral Road.</li>
            </ul>
          </section>
          <section style="margin-top: 2rem;">
            <h2>Why Choose Rupali Construction?</h2>
            <p>We combine advanced digital cost forecasting, transparent Milestone-based billing, standard-exceeding raw material quality (TATA Tata Steel, UltraTech Cement, Fenesta animations), and strictly adhered project completion timelines.</p>
          </section>
          <section style="margin-top: 2rem;">
            <h2>Frequently Asked Questions</h2>
            <div>
              <h3>What is the starting construction cost per square foot in Gurgaon?</h3>
              <p>Our turnkey construction packages start from competitive standard luxury tiers up to ultra-luxury bespoke specifications, complete with itemized material billing and strict zero-hidden-cost policies.</p>
            </div>
            <div>
              <h3>Do you assist with architectural floor planning and architectural sanctions in Gurugram?</h3>
              <p>Yes, our internal studio of architectural engineers manages comprehensive blueprint generation, HUDA/MCG building approvals, structural stress evaluations, and 3D architectural walk-throughs.</p>
            </div>
          </section>
          <footer style="margin-top: 3rem; border-top: 1px solid #ccc; padding-top: 1.5rem;">
            <h2>Contact Rupali Construction</h2>
            <p><strong>Corporate Office:</strong> 5th floor, M3M Broadway, Sector 71, Gurugram, Haryana 122004</p>
            <p><strong>Direct Consultation:</strong> +91 93118 30088 | ujjwalt.rg@rupalihomes.com</p>
            <nav style="margin-top: 1rem;">
              <a href="/services">Services</a> | <a href="/projects">Projects Portfolio</a> | <a href="/blog">Engineering Blog</a> | <a href="/leadership">Leadership</a> | <a href="/brand-standards">Brand Standards</a> | <a href="/contact">Contact Us</a>
            </nav>
          </footer>
        </main>
      `,
    };
  }

  if (cleanPath === "/services") {
    return {
      title: "Construction & Architectural Services in Gurgaon | Rupali Construction",
      description: "Explore our expert services: residential villa construction, turnkey commercial interiors, real estate consulting, and Vastu-compliant architectural planning in Gurugram.",
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

  if (cleanPath === "/projects") {
    let projectsHtml = "<p>Loading recent projects...</p>";
    try {
      const db = getDb();
      const latestProjects = await db.select().from(projects).orderBy(desc(projects.createdAt)).limit(12);
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
      title: "Featured Luxury Villa & Commercial Projects | Rupali Construction",
      description: "Browse Rupali Construction's extensive portfolio of completed and ongoing luxury residential villas, commercial structures, and custom interiors in Gurgaon.",
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
    try {
      const db = getDb();
      const [proj] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
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
          "@context": "https://schema.org",
          "@type": "Product",
          "name": proj.name,
          "image": imageUrl,
          "description": description,
          "brand": {
            "@type": "Brand",
            "name": "Rupali Construction"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": "On Request",
            "availability": "https://schema.org/InStock",
          }
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
                <span><strong>Status:</strong> ${escapeHtml(proj.status.toUpperCase())}</span> |
                <span><strong>Built Area:</strong> ${escapeHtml(proj.area || "Custom Plan")}</span>
              </div>
              <article style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
                <p>${escapeHtml(proj.description || "Project specifications under final processing.")}</p>
              </article>
              ${proj.cost ? `<p><strong>Estimated Capital Value / Budget:</strong> ${escapeHtml(proj.cost)}</p>` : ""}
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
    } catch (err) {
      console.error(`Error fetching project ${slug} for prerender:`, err);
    }

    const title = `${escapeHtml(slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))} | Luxury Project in Gurugram by Rupali Construction`;
    const description = "Explore this turnkey residential villa and commercial construction installation engineered by Rupali Construction in Gurugram, Haryana.";
    return {
      title,
      description,
      canonical: `${BASE_URL}/projects/${slug}`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Turnkey residential villa and commercial structural development in Gurgaon engineered by Rupali Construction."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1000px; margin: 0 auto;">
          <nav><a href="/projects">← Back to All Projects</a></nav>
          <h1 style="font-size: 2.2rem; margin-top: 1rem;">${escapeHtml(slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))}</h1>
          <div style="color: #666; margin-bottom: 1.5rem;">
            <span><strong>Location:</strong> Gurugram, Haryana</span> |
            <span><strong>Type:</strong> LUXURY ARCHITECTURAL BUILD</span>
          </div>
          <article style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">
            <p>Explore this bespoke turnkey construction project designed and developed by Rupali Construction's architectural studio in Gurugram. Engineered with Grade Fe500D primary steel reinforcement, earthquake-resistant structural RCC frameworks, Italian marble interior layouts, and custom Vastu spatial orientation.</p>
          </article>
          <footer style="margin-top: 3rem; background: #f9f9f9; padding: 1.5rem; border-radius: 8px;">
            <h3>Interested in building a custom residence or commercial asset in Gurugram?</h3>
            <p>Contact our structural engineers and architectural directors for plot appraisal and itemized cost forecasting.</p>
            <a href="/contact">Request Project Cost Estimate →</a>
          </footer>
        </main>
      `,
    };
  }

  if (cleanPath === "/blog") {
    let blogsHtml = "<p>Loading latest engineering publications...</p>";
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
    try {
      const db = getDb();
      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
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
    } catch (err) {
      console.error(`Error fetching blog post ${slug} for prerender:`, err);
    }

    const title = `${escapeHtml(slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))} | Rupali Construction Engineering Blog`;
    const description = "Read authoritative architectural and engineering construction guidance from Rupali Construction's master civil design studio in Gurgaon.";
    return {
      title,
      description,
      canonical: `${BASE_URL}/blog/${slug}`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd(),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 850px; margin: 0 auto;">
          <nav><a href="/blog">← Back to Blog Articles</a></nav>
          <article style="margin-top: 1.5rem;">
            <h1 style="font-size: 2.4rem; line-height: 1.3;">${escapeHtml(slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))}</h1>
            <p style="color: #777; margin-bottom: 2rem;">By <strong>Rupali Construction Engineering Studio</strong> | Category: <em>Architectural Guides & Construction Standards</em></p>
            <div style="font-size: 1.15rem; line-height: 1.8; color: #222;">
              <p>Discover advanced engineering methodologies, construction cost breakdowns, structural durability metrics, and spatial design best practices for homeowners building in Gurgaon and Delhi NCR. Our internal studio of master civil engineers combines modern biometric energy modeling with classical Vastu orientations to deliver enduring residential villas and corporate workspaces across Sector 71, Golf Course Extension Road, and Southern Peripheral Road.</p>
            </div>
          </article>
          <footer style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid #ccc;">
            <h3>Discuss your construction blueprints with our engineering directors</h3>
            <a href="/contact">Contact Rupali Construction Corporate Studio →</a>
          </footer>
        </main>
      `,
    };
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
      title: "Brand Standards & Quality Construction Specifications | Rupali Construction",
      description: "Review Rupali Construction's non-negotiable architectural specifications: TATA Steel reinforcement, UltraTech concrete, imported waterproofing, and digital site quality auditing.",
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
      title: "Contact Rupali Construction | Corporate Office in Sector 71 Gurgaon",
      description: "Get in touch with Rupali Construction for architectural consultation, villa cost estimates, and real estate inquiry. Corporate office: 5th floor, M3M Broadway, Sector 71, Gurugram.",
      canonical: `${BASE_URL}/contact`,
      ogImage: DEFAULT_IMAGE,
      jsonLd: getDefaultJsonLd("Contact information and Gurugram headquarters for Rupali Construction."),
      semanticHtml: `
        <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1000px; margin: 0 auto;">
          <h1>Contact Our Architectural & Construction Studio</h1>
          <p>Schedule an in-person meeting at our corporate headquarters or book a virtual Vastu & architectural appraisal.</p>
          <address style="font-style: normal; margin-top: 2rem; line-height: 1.8; background: #f4f4f4; padding: 1.5rem; border-radius: 8px;">
            <p><strong>Corporate Headquarters:</strong> 5th floor, M3M Broadway, Sector 71, Gurugram, Haryana 122004</p>
            <p><strong>Phone Consultation:</strong> <a href="tel:+919311830088">+91 93118 30088</a></p>
            <p><strong>Email Address:</strong> <a href="mailto:ujjwalt.rg@rupalihomes.com">ujjwalt.rg@rupalihomes.com</a></p>
            <p><strong>Working Hours:</strong> Monday – Saturday, 9:00 AM – 7:00 PM IST</p>
          </address>
        </main>
      `,
    };
  }

  // Fallback for custom or admin routes
  return {
    title: "Rupali Construction | Crafting Architecture into Reality in Gurugram",
    description: "Rupali Construction is a premier Gurgaon-based architectural construction contractor specializing in luxury residential villas, turnkey interiors, commercial building, and real estate consulting.",
    canonical: `${BASE_URL}${cleanPath}`,
    ogImage: DEFAULT_IMAGE,
    jsonLd: getDefaultJsonLd(),
    semanticHtml: `
      <main class="seo-prerender-container" style="padding: 2rem; font-family: sans-serif; max-width: 1100px; margin: 0 auto; line-height: 1.7;">
        <h1>Rupali Construction | Crafting Architecture into Reality</h1>
        <p style="font-size: 1.2rem; color: #555;">Premier architectural and construction engineering contractors headquartered in Gurgaon, Haryana.</p>
        <section style="margin-top: 2rem;">
          <h2>Our Architectural Studio & Engineering Services</h2>
          <p>We deliver Grade-A residential villa construction, turnkey commercial interiors, real estate valuation consulting, and Vastu-compliant structural floor planning across prime sectors in Gurugram.</p>
        </section>
        <footer style="margin-top: 3rem; border-top: 1px solid #ddd; padding-top: 1.5rem;">
          <p><strong>Corporate Office:</strong> 5th floor, M3M Broadway, Sector 71, Gurugram, Haryana 122004</p>
          <nav style="margin-top: 1rem;">
            <a href="/services">Services</a> | <a href="/projects">Projects Portfolio</a> | <a href="/blog">Engineering Blog</a> | <a href="/contact">Contact Us</a>
          </nav>
        </footer>
      </main>
    `,
  };
}

export async function seoPrerenderHandler(c: Context) {
  try {
    const url = new URL(c.req.url);
    const pageData = await resolvePageData(url.pathname);
    let html = getHtmlTemplate();

    // Replace Title
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${pageData.title}</title>`);
    if (!/<title>/i.test(html)) {
      html = html.replace("</head>", `<title>${pageData.title}</title>\n</head>`);
    }

    // Replace Description & Meta tags
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${pageData.description}" />`);
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${pageData.canonical}" />`);

    // Inject OpenGraph & Twitter tags and JSON-LD schema into head
    const schemaScript = Array.isArray(pageData.jsonLd)
      ? pageData.jsonLd.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n")
      : `<script type="application/ld+json">${JSON.stringify(pageData.jsonLd)}</script>`;

    const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${pageData.canonical}" />
    <meta property="og:title" content="${pageData.title}" />
    <meta property="og:description" content="${pageData.description}" />
    <meta property="og:image" content="${pageData.ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${pageData.canonical}" />
    <meta name="twitter:title" content="${pageData.title}" />
    <meta name="twitter:description" content="${pageData.description}" />
    <meta name="twitter:image" content="${pageData.ogImage}" />
    ${schemaScript}
    `;

    html = html.replace("</head>", `${ogTags}\n</head>`);

    // Inject Semantic Content directly into root container for AI bots and immediate FCP
    html = html.replace(/<div id=["']root["']>\s*<\/div>/i, `<div id="root">${pageData.semanticHtml}</div>`);

    c.header("Content-Type", "text/html; charset=utf-8");
    c.header("Cache-Control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400");
    return c.body(html);
  } catch (err) {
    console.error("Error in seoPrerenderHandler:", err);
    // Fallback to plain html on unexpected exception
    c.header("Content-Type", "text/html; charset=utf-8");
    return c.body(getHtmlTemplate());
  }
}
