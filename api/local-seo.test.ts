import { describe, expect, it, vi } from "vitest";
import { Hono } from "hono";
import { business, homeSeo, localFaqs } from "../shared/local-seo";
import { fallbackPosts } from "../shared/blog-content";
import { generateSitemapXml } from "../server/sitemap";

vi.mock("../server/queries/connection.js", () => ({ getDb: () => {
  const query = {
    from: () => query, where: () => query, orderBy: () => query,
    limit: async () => [],
    then: (resolve: (rows: unknown[]) => unknown) => Promise.resolve([]).then(resolve),
  };
  return { select: () => query };
} }));
import { seoPrerenderHandler } from "../server/seo-prerender";

const app = new Hono();
app.get("*", seoPrerenderHandler);

function schemas(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map((match) => JSON.parse(match[1]));
}

describe("local search HTML", () => {
  it("serves the Gurugram positioning and readable answers before JavaScript runs", async () => {
    const response = await app.request("/");
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain(`<title>${homeSeo.title.replace(/&/g, "&amp;")}</title>`);
    expect(html).not.toContain("AI-Powered");
    expect(html).not.toContain('aria-hidden="true"');
    expect(html).not.toContain("opacity:0");
    for (const faq of localFaqs) {
      expect(html).toContain(faq.question.replace(/'/g, "&#039;"));
    }
    expect(schemas(html).find((schema) => schema["@type"] === "FAQPage").mainEntity)
      .toHaveLength(localFaqs.length);
  });

  it("uses the owner's Maps listing and matching coordinates across public pages", async () => {
    for (const route of ["/", "/contact", "/services"]) {
      const html = await (await app.request(route)).text();
      const contractor = schemas(html).find((schema) => schema["@type"] === "GeneralContractor");
      expect(contractor.hasMap).toBe(business.mapsUrl);
      expect(contractor.geo.latitude).toBe(28.4014816);
      expect(contractor.geo.longitude).toBe(77.0190575);
      expect(html).not.toContain("28.3971");
      expect(html.match(/property="og:title"/g)).toHaveLength(1);
      expect(html.match(/name="twitter:title"/g)).toHaveLength(1);
      expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    }
  });

  it("keeps account pages out of search and omits public content", async () => {
    const html = await (await app.request("/profile")).text();
    expect(html).toContain('content="noindex, nofollow"');
    expect(html).not.toContain('class="seo-prerender-container"');
    expect(html).not.toContain('name="geo.position"');
  });

  it("serves actual shared article content and rejects invented URLs", async () => {
    const html = await (await app.request(`/blog/${fallbackPosts[0].slug}`)).text();
    expect(html).toContain(fallbackPosts[0].content.slice(0, 80));
    for (const route of ["/blog/nonexistent-article", "/projects/nonexistent-project", "/services/nonexistent-service", "/nonexistent-page"]) {
      const response = await app.request(route);
      expect(response.status).toBe(404);
      const missing = await response.text();
      expect(missing).toContain('content="noindex, nofollow"');
      expect(schemas(missing)).toHaveLength(0);
      expect(missing).not.toContain("Looking for the best builder in Gurgaon?");
    }
  });

  it("includes the homeowner guide and uses canonical service URLs", async () => {
    const response = await app.request("/building-guide-gurgaon");
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Compare itemised quotes");
    const alias = await app.request("/services/turnkey");
    expect(alias.status).toBe(301);
    expect(alias.headers.get("location")).toBe("/services/residential-construction");
  });

  it("lists real guides with stable dates and excludes private routes", async () => {
    const xml = await generateSitemapXml();
    expect(xml).toContain("https://rupaliconstruction.com/building-guide-gurgaon");
    expect(xml).toContain("<loc>https://rupaliconstruction.com/</loc>");
    expect(xml).not.toContain("AI-Powered");
    expect(xml).not.toContain("/profile");
    expect(xml).not.toContain("/login");
    expect(xml).toContain("<lastmod>2026-10-22</lastmod>");
    const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    expect(new Set(locations).size).toBe(locations.length);
  });
});
