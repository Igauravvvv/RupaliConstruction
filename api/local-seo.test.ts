import { describe, expect, it, vi } from "vitest";
import { Hono } from "hono";
import { business, homeSeo, localFaqs } from "../shared/local-seo";

vi.mock("../server/queries/connection.js", () => ({ getDb: vi.fn() }));
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
    expect(html).toContain(`<title>${homeSeo.title}</title>`);
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
});
