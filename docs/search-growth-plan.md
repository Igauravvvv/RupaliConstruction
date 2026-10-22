# Rupali Construction search growth plan

Prepared 22 October 2026. Goal: earn relevant construction enquiries from Gurgaon/Gurugram through organic search, Google Maps, Bing, Yandex and AI search citations. No first-place ranking or indexing date is promised. Google Workspace email and document accounts are separate from the Google Business Profile that appears in Maps.

## What the audit found and what was implemented

- The deployed homepage was a static Vite shell without readable body content or JSON-LD before JavaScript. The build now includes visible homepage content, business details, internal links and matching structured data. The interactive React site replaces this content when it loads.
- Server-rendered project and article fallbacks did not include the content visitors could read. Shared content now supplies both versions. Missing URLs return 404; a failed database lookup for an unknown content URL returns 503 instead of inventing a page. Unpublished database articles are not exposed.
- A static public sitemap masked the dynamic sitemap handler. It was removed so the live sitemap can include actual database projects and published articles, along with the shared fallback content and service pages. Modification dates are no longer rewritten every day for unchanged static pages. Unknown project modification dates are omitted.
- The old HTML sitemap mixed navigation with unsupported rating/warranty statements, location filters and browser-only keyword editing. It is now a navigation page linked to actual services, projects and articles. Editing keywords in a visitor's browser does not improve rankings.
- Home, service and contact metadata now focus on construction in Gurgaon/Gurugram. A practical builder-selection guide supports the main commercial pages; duplicate pages for each spelling or keyword are avoided.
- The correct business Maps identity, address, phone and coordinates are present. An IndexNow verification file and submission script notify participating search engines about published URLs. Acceptance does not confirm indexing or ranking.

## Search intent and page map

| Search intent | Primary page | Supporting evidence |
| --- | --- | --- |
| best builder in Gurgaon / Gurugram; best contractor in Gurgaon / Gurugram | `/` | Clear services, builder-selection guidance, relevant project links and business identity |
| house construction, turnkey villa construction Gurgaon | `/services/residential-construction` | Process, scope, project examples and enquiry link |
| commercial contractor Gurgaon | `/services/commercial-construction` | Relevant commercial portfolio and scope |
| renovation contractor Gurgaon | `/services/renovation` | Existing service information and relevant projects |
| architectural, interior or structural services | Matching `/services/...` page | A distinct service purpose, process and FAQ |
| how to choose a builder; compare contractor quotes | `/building-guide-gurgaon` | Practical quote, materials, schedule and responsibility checks |
| construction costs and timelines | Existing `/blog/...` guides | Review rates, dates and regulatory statements with a qualified local professional before treating them as current advice |
| Rupali Construction address, phone, directions | `/contact` and Google Business Profile | Consistent name, address, phone, hours and Maps location |

Keep the homepage as the primary broad builder/contractor page. Do not create near-identical pages for every sector or for Gurgaon versus Gurugram. Add a location page only when there is original, useful evidence of work there.

## Google Business Profile: saved changes and remaining growth work

The owner completed authentication. Saved and read back in Google: canonical HTTPS website, updated service-focused description, Gurugram service area, additional Home builder and General Contractor categories, and owner-confirmed postcode 122001. The primary category remains Real Estate Builders & Construction Company. The owner confirmed daily 10:00–19:00 hours, matching the existing profile; the website was aligned. The public result showed a 4.6 rating from 9 Google reviews at inspection. The existing listing, reviews and ownership were preserved.

1. Verify that the business is claimed and eligible, and that the map pin and customer-facing office details are correct. The owner-supplied listing identifies coordinates 28.4014816, 77.0190575; the website address is 5th floor, M3M Broadway, Sector 71, Gurugram, Haryana 122001. The owner confirmed postcode 122001. It was saved in the profile and website. The existing plus-code street address and map pin were preserved; adding the M3M Broadway street description should be verified against the physical office before editing.
2. Keep the real business name **Rupali Construction**. Do not append “best builder in Gurgaon” to the business name unless it is genuinely the established real-world business name.
3. Inspect the available category choices and choose the most accurate primary category for the actual main business. Compare “Construction company”, “General contractor” and “Home builder” where available; add only accurate secondary categories. Category availability must be checked inside the profile.
4. The owner confirmed daily 10:00–19:00 hours. The profile already matched; website contact copy, business schema and FAQs were aligned. The phone remains +91 93118 30088. Confirm holiday hours separately.
5. Add the services actually offered: residential construction, commercial construction, renovation, interior design, architectural design and structural engineering, with plain-language descriptions matching the site.
6. Proposed description: “Rupali Construction provides residential and commercial construction, turnkey villas, renovation, architecture, structural engineering and interiors in Gurgaon (Gurugram) and Delhi NCR. Discuss your plot, design, material specifications and project scope with our team at M3M Broadway, Sector 71. Explore our project portfolio and contact us to arrange a construction consultation.”
7. Use `https://rupaliconstruction.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile` as the website URL if the owner wants profile traffic attribution. Confirm analytics is configured before treating this as measurable reporting.
8. Add genuine, permitted project photos with useful captions, plus office/signage and team photos. Do not label stock imagery as completed work. Ask all eligible clients consistently for honest reviews; offer no rewards, scripts, keyword requirements or review gating. Reply helpfully to genuine reviews only when separately authorised to post replies.
9. Obtain real local references and links from completed-project partners, architects, suppliers and appropriate local directories. Keep name, address and phone consistent. Do not buy links, reviews or mass directory submissions.

## Webmaster setup: requires the relevant owner account

| Service | Concrete next action | Access/status |
| --- | --- | --- |
| Google Search Console | Inspect the existing property; verify ownership if needed; submit `https://rupaliconstruction.com/sitemap.xml`; inspect home, guide and key service URLs; request indexing where available | Existing Google verification files are present; ownership and submission status are unverified |
| Bing Webmaster Tools | Inspect/import the property, submit the sitemap and check URL Inspection and IndexNow reporting | No authenticated account available in this session |
| Yandex Webmaster | Verify the site, submit the sitemap and inspect crawl errors and indexing exclusions | No authenticated account available in this session |
| Google Business Profile | Apply the proposal above after reviewing current profile fields and confirming business facts | Description, URL, categories, service area and postcode saved and read back |
| Analytics | Check whether an existing property measures enquiries, successful form submissions and telephone clicks; retain consent requirements | No analytics property inspected; no new tracking deployed |

Do not fabricate verification codes. Preserve existing Google verification files. Google no longer supports the old sitemap ping endpoint. IndexNow is a notification channel for participating engines; it is not a Google indexing API. Do not use Google's restricted Indexing API for ordinary construction pages.

IndexNow accepted the first seven updated URLs with HTTP 202 on 22 October 2026; indexing is unconfirmed. For later deployments, run `npm run seo:submit` with a working Node environment. The script checks the verification file and HTTP status of submitted URLs before notifying IndexNow. Submit future changed URLs explicitly, for example `npm run seo:submit -- /services/renovation`.

## 30/60/90-day work and measurement

**Days 1–30:** Complete the webmaster and profile tasks above. Record the baseline from Search Console and profile performance. Review claims such as completed-home totals, awards, warranties, guarantees and certifications against business records. Publish 2–3 detailed, approved project case studies with location, scope, real photos, dates and material decisions. Review mobile performance, including the 3D hero, using PageSpeed Insights and field data when available.

**Days 31–60:** Improve pages that receive relevant impressions but few clicks; check whether titles match the actual service and user need. Strengthen service-to-project and article-to-service links. Update the existing cost/timeline articles with verified project-specific examples rather than producing repetitive new articles. Obtain legitimate partner references and genuine client feedback.

**Days 61–90:** Compare like-for-like periods and target locations. Expand topics based on actual queries and qualified enquiries. Diagnose indexing issues and content gaps before adding more pages. Review evidence of AI citations using each product's available reports; manual spot-checks are directional and are not a universal AI rank.

Track organic impressions, clicks, non-brand queries, average position by query/page, indexed URLs, qualified enquiries, and profile website clicks/calls/direction requests where reported. Check Maps visibility from consistent Gurgaon locations because distance changes results. Keep Google, Bing, Yandex and Maps reporting separate. There is no universal “G”, “MO” or “AI” ranking score established by this work. Third-party authority scores are diagnostics, not Google's ranking metric.

## Official references

- [Google: improve local ranking](https://support.google.com/business/answer/7091?hl=en)
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [IndexNow protocol and response meanings](https://www.indexnow.org/documentation)
- [Yandex: sitemap discovery](https://yandex.com/support/webmaster/en/robot-workings/sitemap)
