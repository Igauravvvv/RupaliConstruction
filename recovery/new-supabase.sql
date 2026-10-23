BEGIN;
DO $$ BEGIN CREATE TYPE "public"."auth_provider" AS ENUM('local', 'google'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "public"."chat_role" AS ENUM('user', 'assistant'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'follow-up', 'converted', 'closed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "public"."project_status" AS ENUM('ongoing', 'completed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "public"."project_type" AS ENUM('residential', 'commercial', 'renovation', 'interior'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "public"."role" AS ENUM('user', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "public"."status" AS ENUM('new', 'read', 'replied', 'archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"coverImage" text,
	"category" varchar(100),
	"tags" text,
	"author" varchar(255),
	"published" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(255) NOT NULL,
	"role" "chat_role" NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "construction_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"referenceId" varchar(20) NOT NULL,
	"name" varchar(255),
	"phone" varchar(50),
	"email" varchar(320),
	"state" varchar(100),
	"city" varchar(100),
	"area" varchar(255),
	"pinCode" varchar(20),
	"projectType" varchar(100),
	"residentialType" varchar(100),
	"plotSize" varchar(100),
	"constructionStage" varchar(100),
	"budget" varchar(100),
	"timeline" varchar(100),
	"preferredCallTime" varchar(100),
	"enquiryType" varchar(100) DEFAULT 'construction' NOT NULL,
	"lead_status" "lead_status" DEFAULT 'new' NOT NULL,
	"assignedTo" varchar(255),
	"remarks" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "construction_leads_referenceId_unique" UNIQUE("referenceId")
);

CREATE TABLE IF NOT EXISTS "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"city" varchar(100),
	"service" varchar(100),
	"budget" varchar(100),
	"message" text,
	"status" "status" DEFAULT 'new' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cost_calculator_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"referenceId" varchar(20) NOT NULL,
	"city" varchar(100),
	"propertyType" varchar(100),
	"plotSize" varchar(100),
	"floors" integer,
	"quality" varchar(50),
	"estimatedCost" varchar(100),
	"name" varchar(255),
	"phone" varchar(50),
	"email" varchar(320),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cost_calculator_requests_referenceId_unique" UNIQUE("referenceId")
);

CREATE TABLE IF NOT EXISTS "local_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uniqueId" varchar(20) NOT NULL,
	"username" varchar(255) NOT NULL,
	"displayName" varchar(255),
	"email" varchar(320),
	"phoneNumber" varchar(50),
	"passwordHash" varchar(255),
	"googleId" varchar(255),
	"avatar" text,
	"authProvider" "auth_provider" DEFAULT 'local' NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "local_users_uniqueId_unique" UNIQUE("uniqueId"),
	CONSTRAINT "local_users_username_unique" UNIQUE("username"),
	CONSTRAINT "local_users_googleId_unique" UNIQUE("googleId")
);

CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"location" varchar(255),
	"area" varchar(100),
	"duration" varchar(100),
	"type" "project_type" DEFAULT 'residential' NOT NULL,
	"status" "project_status" DEFAULT 'completed' NOT NULL,
	"images" text,
	"featured" boolean DEFAULT false NOT NULL,
	"completionDate" varchar(50),
	"cost" varchar(100),
	"process_steps" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(255),
	"project" varchar(255),
	"rating" integer DEFAULT 5 NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"featured" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"unionId" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(320),
	"phoneNumber" varchar(50),
	"avatar" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignInAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_unionId_unique" UNIQUE("unionId")
);

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profileCompleted" boolean DEFAULT false NOT NULL;
ALTER TABLE "local_users" ADD COLUMN IF NOT EXISTS "profileCompleted" boolean DEFAULT false NOT NULL;
ALTER TABLE "local_users" ADD COLUMN IF NOT EXISTS "lastSignInAt" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "chat_messages" ADD COLUMN IF NOT EXISTS "userId" integer DEFAULT 0 NOT NULL;

CREATE INDEX IF NOT EXISTS "users_last_sign_in_at_idx" ON "users" ("lastSignInAt");
CREATE INDEX IF NOT EXISTS "local_users_last_sign_in_at_idx" ON "local_users" ("lastSignInAt");
CREATE INDEX IF NOT EXISTS "contacts_status_created_at_idx" ON "contacts" ("status", "createdAt");
CREATE INDEX IF NOT EXISTS "blog_posts_published_created_at_idx" ON "blog_posts" ("published", "createdAt");
CREATE INDEX IF NOT EXISTS "blog_posts_category_published_created_at_idx" ON "blog_posts" ("category", "published", "createdAt");
CREATE INDEX IF NOT EXISTS "projects_filter_created_at_idx" ON "projects" ("type", "status", "featured", "createdAt");
CREATE INDEX IF NOT EXISTS "testimonials_featured_created_at_idx" ON "testimonials" ("featured", "createdAt");
CREATE INDEX IF NOT EXISTS "chat_messages_user_session_created_at_idx" ON "chat_messages" ("userId", "sessionId", "createdAt");
CREATE INDEX IF NOT EXISTS "construction_leads_status_created_at_idx" ON "construction_leads" ("lead_status", "createdAt");
CREATE INDEX IF NOT EXISTS "cost_calculator_requests_created_at_idx" ON "cost_calculator_requests" ("createdAt");

ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "reviewerName" varchar(120);
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "reviewerRole" varchar(160);
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "reviewText" text;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "instagramVideoUrl" text;

ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "construction_leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cost_calculator_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "local_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
INSERT INTO projects ("name","slug","description","location","area","completionDate","type","status","featured","images") VALUES ('QuickIn Stayz','quickin-stayz','Modern turnkey commercial hospitality and boutique suites located in Sushant Lok 1, Sector 43, Gurugram.','Block - C, Sushant Lok 1, Sector 43, Gurugram','35,000 sq ft','2024','commercial','completed',true,'[]') ON CONFLICT (slug) DO NOTHING;
INSERT INTO projects ("name","slug","description","location","area","completionDate","type","status","featured","images") VALUES ('Gold Gym','gold-gym','State-of-the-art commercial fitness facility with heavy reinforced civil flooring, industrial acoustic isolation, and premium MEP systems at M3M Urbana, Sector 67, Gurgaon.','Sector 67, M3M URBANA, Gurgaon','11,000 sq ft','2024','commercial','completed',true,'["https://tofmglzhxvdozgnwmvhb.supabase.co/storage/v1/object/public/images/1785225169394-250938775.png","https://tofmglzhxvdozgnwmvhb.supabase.co/storage/v1/object/public/images/1785225169295-375624683.png","https://tofmglzhxvdozgnwmvhb.supabase.co/storage/v1/object/public/images/1785225169344-190570374.png","https://tofmglzhxvdozgnwmvhb.supabase.co/storage/v1/object/public/images/1785225169367-222471526.png","https://tofmglzhxvdozgnwmvhb.supabase.co/storage/v1/object/public/images/1785225169320-757856043.png","https://tofmglzhxvdozgnwmvhb.supabase.co/storage/v1/object/public/images/1785225169227-411774767.png","https://tofmglzhxvdozgnwmvhb.supabase.co/storage/v1/object/public/images/1785225169271-859573308.png"]') ON CONFLICT (slug) DO NOTHING;
INSERT INTO projects ("name","slug","description","location","area","completionDate","type","status","featured","images") VALUES ('Knowledge Center','knowledge-center','Iconic commercial landmark featuring corporate innovation suites, knowledge auditoriums, and cutting-edge civil infrastructure at M3M Broadway, Sector 71, Gurugram.','M3M Broadway, Sector 71, Gurugram','100,000 sq ft','2024','commercial','completed',true,'[]') ON CONFLICT (slug) DO NOTHING;
INSERT INTO projects ("name","slug","description","location","area","completionDate","type","status","featured","images") VALUES ('Duplex Luxury Villa','duplex-luxury-villa','Turnkey luxury duplex villa crafted with modern architecture, premium structural engineering, and high-end finishes in The Westerlies, Sector 108, Gurugram.','The Westerlies, Sector 108, Gurugram','3,240 sq ft','2024','residential','completed',true,'[]') ON CONFLICT (slug) DO NOTHING;
INSERT INTO projects ("name","slug","description","location","area","completionDate","type","status","featured","images") VALUES ('Apartment At Sushant Lok','apartment-at-sushant-lok','Premium residential apartment floor with bespoke interior craftsmanship and civil upgrades in Sushant Lok, Gurgaon.','Sushant Lok 1, Gurugram','1,800 sq ft','2024','residential','completed',true,'[]') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('Cost of Building a House in Gurgaon: Complete 2026 Guide','cost-of-building-house-gurgaon','Understand the complete cost breakdown for building a house in Gurgaon, from land acquisition to final handover. Includes per sq ft rates for different construction types.','Planning an independent house or luxury villa in Gurugram is one of the most significant personal and financial milestones you will ever undertake. In 2026, home construction costs across Gurgaon and Delhi NCR range between ₹1,600 and ₹3,500+ per square foot of built-up area. However, without a transparent, itemized Bill of Quantities (BoQ) and an understanding of municipal compliance, homeowners often face 20% to 35% unexpected cost overruns.

In this definitive guide, our senior civil engineers at Rupali Construction break down the real numbers, material costs, statutory fees, and engineering realities of building a house in Gurgaon.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. AVERAGE CONSTRUCTION COST TIERS (2026 MARKET RATES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. Standard Specification (₹1,600 – ₹1,900 / sq. ft.)
• Best suited for: Rental builder floors, budget residences, and basic developments.
• Structural Framework: ISI-marked Fe-500 TMT steel, OPC 43 grade cement (Ambuja/Birla), local red clay kiln bricks.
• Flooring & Finishes: Double-charged vitrified floor tiles (600x600mm), standard tractor emulsion paint.
• Electrical & Plumbing: Concealed Polycab FR copper wiring, modular switches, Astral UPVC/CPVC piping, Cera or Hindware sanitary fittings.

B. Premium Turnkey Specification (₹2,100 – ₹2,600 / sq. ft.)
• Best suited for: Luxury independent villas in Sector 57, 43, 71, and Sushant Lok.
• Structural Framework: Tata Tiscon or JSW Neosteel Fe-500D rebar, UltraTech Super OPC 53 cement, AAC lightweight thermal blocks.
• Flooring & Finishes: 4x2 ft glazed vitrified tiles or Indian Banswara/Makrana marble, plastic emulsion paint, Fenesta soundproof UPVC windows.
• Electrical & Plumbing: Havells/Finolex FRLS wiring, Schneider modular plates, Grohe/Kohler concealed bathroom fittings.

C. Ultra-Bespoke Signature Specification (₹2,800 – ₹3,500+ / sq. ft.)
• Best suited for: Signature luxury villas in DLF Phases 1-5, Golf Course Road, and The Westerlies.
• Structural Framework: M30 design mix ready-mix concrete, Tata Tiscon Fe-550D rebar, deep raft or pile foundation with anti-seismic ductile detailing.
• Flooring & Finishes: Imported Italian marble (Bottochino/Dyna/Statuario), Schüco slim-profile thermal-break aluminum fenestration, solid teakwood doors.
• Electrical & Plumbing: Bravat or Grohe thermostatic shower systems, CAT-7 smart home automation wiring, automated pressure booster pumps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. WHERE DOES YOUR MONEY GO? (PERCENTAGE BREAKDOWN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Substructure & Civil Core (45% - 50%): Earth excavation, foundation casting, TMT steel, cement, sand, aggregates, and masonry brickwork.
• MEP & Concealed Infrastructure (15% - 18%): Sanitary piping, water drainage, electrical conduit lines, distribution panels, and earthing pits.
• Architectural Finishes (25% - 30%): Plastering, wall putty, false ceiling, flooring marble/tiles, exterior weather-shield cladding, painting, and fenestration.
• Permits, Soil Audit & Approvals (3% - 5%): Soil investigation (SPT), structural engineering vetting, MCG/DTCP scrutiny fees, and labor cess.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SAMPLE BUDGET FOR A 250 SQ. YARD PLOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
On a typical 250 sq. yard plot in Gurgaon (approx. 2,250 sq. ft.), a sanctioned Stilt + 3 Floors structure yields roughly 6,000 sq. ft. of total covered built-up area:
• Standard Build: 6,000 sq. ft. × ₹1,750 = ₹1.05 Crore
• Premium Turnkey: 6,000 sq. ft. × ₹2,350 = ₹1.41 Crore
• Ultra Bespoke: 6,000 sq. ft. × ₹3,100 = ₹1.86 Crore

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CRITICAL LOCAL FACTORS IN GURUGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Seismic Zone IV Structural Mandates: Gurgaon lies in a high-seismic risk belt. Standard column sizing and stirrup spacing must conform to IS 13920 ductile detailing.
• Soil Strata Variations: Sectors near the Aravalli range require rock chiseling, whereas sectors along the Dwarka Expressway feature clayey silt requiring deep raft footings.
• Winter Pollution GRAP Restrictions: Government GRAP-III and IV curbs temporarily halt outdoor excavation during winter months. A professional contractor buffers these periods by advancing factory woodwork, indoor MEP, and off-site fabrication.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. HOW RUPALI CONSTRUCTION GUARANTEES COST CONTROL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
At Rupali Construction (M3M Broadway, Sector 71), we execute locked zero-deviation BoQs. Every material brand and rate is fixed contractually before ground is broken, paired with an escrow-friendly milestone payment plan and a 10-year structural warranty.','https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80','Cost Guide','Rupali Team',true,'2026-06-15T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('Gurgaon Real Estate Trends 2026: Where to Invest in Residential Properties','gurgaon-real-estate-trends','Explore the booming real estate corridors in Gurgaon. Discover why Dwarka Expressway, New Gurgaon, and SPR are becoming the top choices for custom villa construction.','Gurgaon''s real estate market continues to show robust growth in 2026. The shifting preference towards spacious, custom-built homes has led to increased demand for residential plots in sectors along the Dwarka Expressway, Southern Peripheral Road (SPR), and New Gurgaon. These emerging corridors offer better infrastructure, wider roads, and excellent connectivity to Delhi and the airport. Investing in a plot here and undertaking a custom villa construction project not only provides a personalized living experience but also yields higher appreciation rates compared to standard apartment investments.','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80','Real Estate','Rupali Team',true,'2026-05-22T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('Construction Timeline Breakdown: From Blueprint to Handover in NCR','construction-timeline-breakdown','Learn about the typical construction timeline for residential projects in Gurgaon. Understand each phase from foundation to finishing and how to plan accordingly.','A standard residential construction project in the NCR region takes about 12 to 18 months. Phase 1 (1-2 months) involves architectural planning, structural design, and obtaining necessary approvals from local bodies. Phase 2 (3-6 months) covers excavation, foundation laying, and raising the RCC framework. Phase 3 (4-6 months) is dedicated to masonry, plumbing, electrical conduit laying, and plastering. The final Phase 4 (4-5 months) focuses on flooring, painting, fixture installation, and finishing touches. Unpredictable factors like monsoon rains or brief pollution-related construction bans in NCR can cause slight delays, so buffer time must be built into the schedule.','https://images.unsplash.com/photo-1504307651254-35680f35aa2e?auto=format&fit=crop&q=80','Planning','Rupali Team',true,'2026-04-10T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('Navigating Building Approvals and Regulations in Gurugram (MCG/DTCP)','building-approvals-gurugram','A step-by-step guide to securing building plan approvals from the Municipal Corporation of Gurugram (MCG) and Department of Town and Country Planning (DTCP).','Securing approvals is a critical first step for any construction project in Gurugram. Depending on the location of your plot, you will need clearance from either the MCG or DTCP. The process involves submitting architectural drawings, structural stability certificates, and ownership documents. Recent digitization efforts have streamlined the process, allowing for online submissions via the Haryana Online Building Plan Approval System (HOBPAS). Key regulations to keep in mind include Floor Area Ratio (FAR) limits, maximum permissible ground coverage, stilt parking requirements, and mandatory rainwater harvesting systems for larger plots.','https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80','Regulations','Rupali Team',true,'2026-03-05T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('Top Residential Areas in Gurgaon for Custom Villa Construction','top-residential-areas-gurgaon-villas','Looking to build your dream home? We analyze the best sectors and gated communities in Gurgaon that offer prime plots for custom villa construction.','If you are planning to build a custom villa, location is everything. DLF Phases 1-5 and Golf Course Road offer premium, established neighborhoods but come with steep land costs. For better value and larger plot sizes, investors are turning to sectors along the Golf Course Extension Road (like Sector 65, 66) and emerging luxury townships on the Dwarka Expressway. Gated communities like Tata Primanti, Emaar MGF Marbella, and various BPTP townships offer the security of a closed complex along with the freedom to construct your home according to your own architectural vision. Access to international schools and upcoming metro routes makes these locations highly desirable.','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80','Real Estate','Rupali Team',true,'2026-02-18T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('Sustainable Construction Practices for the Gurgaon Climate','sustainable-construction-gurgaon','Eco-friendly construction methods suited for Gurgaon''s extreme summers and cold winters. Implementing rainwater harvesting, solar integration, and energy-efficient design.','Gurgaon experiences intense heat in the summer and chilling winters, making climate-responsive design essential. Using AAC (Autoclaved Aerated Concrete) blocks instead of traditional red bricks offers superior thermal insulation, reducing HVAC costs. Designing homes with cross-ventilation, shaded south-facing windows, and cool roof technology can drastically lower indoor temperatures. Furthermore, integrating solar panels is highly effective given the region''s abundant sunshine, and mandatory rainwater harvesting systems help recharge the depleting groundwater levels. Sustainable construction not only reduces the carbon footprint but also translates into long-term financial savings.','https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80','Sustainability','Rupali Team',true,'2026-01-30T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('The Rise of Luxury Smart Homes in Gurgaon''s Real Estate Market','luxury-smart-homes-gurgaon','How to plan for smart home technology during the construction phase. Integrating home automation, security systems, and energy management seamlessly.','The modern Gurgaon homeowner expects more than just a well-built structure; they demand a smart, connected living experience. Integrating smart home technology during the construction phase is much easier and cleaner than retrofitting later. Essential infrastructure includes deep electrical backboxes for smart switches, robust neutral wiring throughout the house, and central hubs for managing IoT devices. Popular integrations in luxury villas include automated climate control, smart lighting systems that adjust to natural light, integrated AV systems, and biometric security gates. Future-proofing your home with CAT6/CAT7 cabling ensures it stays technologically relevant for decades.','https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80','Technology','Rupali Team',true,'2025-12-10T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO blog_posts ("title","slug","excerpt","content","coverImage","category","author","published","createdAt") VALUES ('RCC vs Steel Structure: Which is Better for Your NCR Project?','rcc-vs-steel-structure','A comprehensive comparison of RCC and steel structure construction methods, covering cost, durability, construction time, and suitability for different building types.','When constructing a home or commercial building in the National Capital Region (NCR), choosing the right structural framework is crucial. RCC (Reinforced Cement Concrete) is the traditional favorite for residential construction due to its lower material costs, easy availability of skilled labor, and excellent fire resistance. However, PEB (Pre-Engineered Building) steel structures are rapidly gaining popularity for commercial projects and modern luxury homes due to their rapid construction speed—often cutting build times by 40%. While steel structures offer greater architectural flexibility and longer clear spans, they require specialized anti-corrosion treatments and higher upfront investment. Ultimately, the choice depends on your project timeline, design complexity, and budget constraints.','https://images.unsplash.com/photo-1541888081691-1cb11354b670?auto=format&fit=crop&q=80','Engineering','Rupali Team',true,'2025-11-22T00:00:00.000Z') ON CONFLICT (slug) DO NOTHING;
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types) VALUES ('images','images',true,10485760,ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']) ON CONFLICT (id) DO NOTHING;
COMMIT;
SELECT (SELECT count(*) FROM projects) AS projects, (SELECT count(*) FROM blog_posts) AS blog_posts, (SELECT count(*) FROM local_users) AS local_users;
