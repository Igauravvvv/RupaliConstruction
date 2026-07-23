import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  const { data, isLoading } = trpc.blog.list.useQuery({ limit: 12 });

  const posts = data?.items?.length ? data.items : fallbackPosts;

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Background Image with Premium Gradient Fade */}
      <div className="absolute top-0 left-0 w-full h-[70vh] z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1920&q=80" 
          alt="Construction Planning and Blog"
          className="w-full h-full object-cover object-[center_20%] opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--rc-white)] via-[var(--rc-white)]/90 to-transparent" />
      </div>

      <section className="pt-32 pb-16 relative z-10">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="text-label text-[var(--rc-orange)] mb-4">Insights</p>
            <h1 className="text-display-2 text-[var(--rc-dark)] mb-4">
              Construction Blog
            </h1>
            <p className="text-lg text-[var(--rc-muted)]">
              Expert insights, construction tips, and industry updates from the
              Rupali Construction team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[var(--rc-white)] relative z-10">
        <div className="container-rc">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[var(--rc-gray)] h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-2xl border border-[var(--rc-border)] bg-white overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-shadow"
                >
                  <div className="aspect-[16/10] bg-[var(--rc-blue)]/10 flex items-center justify-center relative overflow-hidden">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <span className="text-4xl font-bold text-[var(--rc-blue)]/20">
                        {(post.title || "B").charAt(0)}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-[var(--rc-muted)] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.viewCount || 0} views
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold text-[var(--rc-dark)] mb-2 group-hover:text-[var(--rc-blue)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-sm text-[var(--rc-muted)] line-clamp-3 mb-4 flex-1">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-sm font-medium text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)] transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export const fallbackPosts = [
  {
    id: 1,
    title: "Cost of Building a House in Gurgaon: Complete 2026 Guide",
    slug: "cost-of-building-house-gurgaon",
    excerpt: "Understand the complete cost breakdown for building a house in Gurgaon, from land acquisition to final handover. Includes per sq ft rates for different construction types.",
    content: "Building a house in Gurgaon requires careful financial planning. The construction cost typically ranges between ₹1,800 to ₹3,500 per sq ft depending on the quality of materials and finishes. Key cost factors include land acquisition, approval fees from authorities like MCG/DTCP, material costs (cement, steel, bricks), labor charges, and interior finishing. With rising property values in areas like Golf Course Road and Dwarka Expressway, opting for premium construction can significantly increase your property's overall valuation. Ensure you account for a 10-15% contingency budget for unforeseen expenses during the project lifecycle.",
    coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    category: "Cost Guide",
    author: "Rupali Team",
    published: true,
    viewCount: 1250,
    createdAt: new Date("2026-06-15"),
  },
  {
    id: 2,
    title: "Gurgaon Real Estate Trends 2026: Where to Invest in Residential Properties",
    slug: "gurgaon-real-estate-trends",
    excerpt: "Explore the booming real estate corridors in Gurgaon. Discover why Dwarka Expressway, New Gurgaon, and SPR are becoming the top choices for custom villa construction.",
    content: "Gurgaon's real estate market continues to show robust growth in 2026. The shifting preference towards spacious, custom-built homes has led to increased demand for residential plots in sectors along the Dwarka Expressway, Southern Peripheral Road (SPR), and New Gurgaon. These emerging corridors offer better infrastructure, wider roads, and excellent connectivity to Delhi and the airport. Investing in a plot here and undertaking a custom villa construction project not only provides a personalized living experience but also yields higher appreciation rates compared to standard apartment investments.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    category: "Real Estate",
    author: "Rupali Team",
    published: true,
    viewCount: 2150,
    createdAt: new Date("2026-05-22"),
  },
  {
    id: 3,
    title: "Construction Timeline Breakdown: From Blueprint to Handover in NCR",
    slug: "construction-timeline-breakdown",
    excerpt: "Learn about the typical construction timeline for residential projects in Gurgaon. Understand each phase from foundation to finishing and how to plan accordingly.",
    content: "A standard residential construction project in the NCR region takes about 12 to 18 months. Phase 1 (1-2 months) involves architectural planning, structural design, and obtaining necessary approvals from local bodies. Phase 2 (3-6 months) covers excavation, foundation laying, and raising the RCC framework. Phase 3 (4-6 months) is dedicated to masonry, plumbing, electrical conduit laying, and plastering. The final Phase 4 (4-5 months) focuses on flooring, painting, fixture installation, and finishing touches. Unpredictable factors like monsoon rains or brief pollution-related construction bans in NCR can cause slight delays, so buffer time must be built into the schedule.",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f35aa2e?auto=format&fit=crop&q=80",
    category: "Planning",
    author: "Rupali Team",
    published: true,
    viewCount: 1500,
    createdAt: new Date("2026-04-10"),
  },
  {
    id: 4,
    title: "Navigating Building Approvals and Regulations in Gurugram (MCG/DTCP)",
    slug: "building-approvals-gurugram",
    excerpt: "A step-by-step guide to securing building plan approvals from the Municipal Corporation of Gurugram (MCG) and Department of Town and Country Planning (DTCP).",
    content: "Securing approvals is a critical first step for any construction project in Gurugram. Depending on the location of your plot, you will need clearance from either the MCG or DTCP. The process involves submitting architectural drawings, structural stability certificates, and ownership documents. Recent digitization efforts have streamlined the process, allowing for online submissions via the Haryana Online Building Plan Approval System (HOBPAS). Key regulations to keep in mind include Floor Area Ratio (FAR) limits, maximum permissible ground coverage, stilt parking requirements, and mandatory rainwater harvesting systems for larger plots.",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80",
    category: "Regulations",
    author: "Rupali Team",
    published: true,
    viewCount: 1820,
    createdAt: new Date("2026-03-05"),
  },
  {
    id: 5,
    title: "Top Residential Areas in Gurgaon for Custom Villa Construction",
    slug: "top-residential-areas-gurgaon-villas",
    excerpt: "Looking to build your dream home? We analyze the best sectors and gated communities in Gurgaon that offer prime plots for custom villa construction.",
    content: "If you are planning to build a custom villa, location is everything. DLF Phases 1-5 and Golf Course Road offer premium, established neighborhoods but come with steep land costs. For better value and larger plot sizes, investors are turning to sectors along the Golf Course Extension Road (like Sector 65, 66) and emerging luxury townships on the Dwarka Expressway. Gated communities like Tata Primanti, Emaar MGF Marbella, and various BPTP townships offer the security of a closed complex along with the freedom to construct your home according to your own architectural vision. Access to international schools and upcoming metro routes makes these locations highly desirable.",
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
    category: "Real Estate",
    author: "Rupali Team",
    published: true,
    viewCount: 2450,
    createdAt: new Date("2026-02-18"),
  },
  {
    id: 6,
    title: "Sustainable Construction Practices for the Gurgaon Climate",
    slug: "sustainable-construction-gurgaon",
    excerpt: "Eco-friendly construction methods suited for Gurgaon's extreme summers and cold winters. Implementing rainwater harvesting, solar integration, and energy-efficient design.",
    content: "Gurgaon experiences intense heat in the summer and chilling winters, making climate-responsive design essential. Using AAC (Autoclaved Aerated Concrete) blocks instead of traditional red bricks offers superior thermal insulation, reducing HVAC costs. Designing homes with cross-ventilation, shaded south-facing windows, and cool roof technology can drastically lower indoor temperatures. Furthermore, integrating solar panels is highly effective given the region's abundant sunshine, and mandatory rainwater harvesting systems help recharge the depleting groundwater levels. Sustainable construction not only reduces the carbon footprint but also translates into long-term financial savings.",
    coverImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80",
    category: "Sustainability",
    author: "Rupali Team",
    published: true,
    viewCount: 1360,
    createdAt: new Date("2026-01-30"),
  },
  {
    id: 7,
    title: "The Rise of Luxury Smart Homes in Gurgaon's Real Estate Market",
    slug: "luxury-smart-homes-gurgaon",
    excerpt: "How to plan for smart home technology during the construction phase. Integrating home automation, security systems, and energy management seamlessly.",
    content: "The modern Gurgaon homeowner expects more than just a well-built structure; they demand a smart, connected living experience. Integrating smart home technology during the construction phase is much easier and cleaner than retrofitting later. Essential infrastructure includes deep electrical backboxes for smart switches, robust neutral wiring throughout the house, and central hubs for managing IoT devices. Popular integrations in luxury villas include automated climate control, smart lighting systems that adjust to natural light, integrated AV systems, and biometric security gates. Future-proofing your home with CAT6/CAT7 cabling ensures it stays technologically relevant for decades.",
    coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80",
    category: "Technology",
    author: "Rupali Team",
    published: true,
    viewCount: 1780,
    createdAt: new Date("2025-12-10"),
  },
  {
    id: 8,
    title: "RCC vs Steel Structure: Which is Better for Your NCR Project?",
    slug: "rcc-vs-steel-structure",
    excerpt: "A comprehensive comparison of RCC and steel structure construction methods, covering cost, durability, construction time, and suitability for different building types.",
    content: "When constructing a home or commercial building in the National Capital Region (NCR), choosing the right structural framework is crucial. RCC (Reinforced Cement Concrete) is the traditional favorite for residential construction due to its lower material costs, easy availability of skilled labor, and excellent fire resistance. However, PEB (Pre-Engineered Building) steel structures are rapidly gaining popularity for commercial projects and modern luxury homes due to their rapid construction speed—often cutting build times by 40%. While steel structures offer greater architectural flexibility and longer clear spans, they require specialized anti-corrosion treatments and higher upfront investment. Ultimately, the choice depends on your project timeline, design complexity, and budget constraints.",
    coverImage: "https://images.unsplash.com/photo-1541888081691-1cb11354b670?auto=format&fit=crop&q=80",
    category: "Engineering",
    author: "Rupali Team",
    published: true,
    viewCount: 1940,
    createdAt: new Date("2025-11-22"),
  }
];
