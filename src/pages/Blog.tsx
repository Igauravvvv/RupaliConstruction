import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  const { data, isLoading } = trpc.blog.list.useQuery({ limit: 12 });

  const posts = data?.items || fallbackPosts;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 bg-[var(--rc-gray)]">
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

      <section className="py-16 lg:py-24 bg-[var(--rc-white)]">
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

const fallbackPosts = [
  {
    id: 1,
    title: "Cost of Building a House in Gurgaon: Complete 2024 Guide",
    slug: "cost-of-building-house-gurgaon",
    excerpt: "Understand the complete cost breakdown for building a house in Gurgaon, from land acquisition to final handover. Includes per sq ft rates for different construction types.",
    content: "Detailed guide...",
    coverImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
    category: "Cost Guide",
    author: "Rupali Team",
    published: true,
    viewCount: 1250,
    createdAt: new Date("2024-12-15"),
  },
  {
    id: 2,
    title: "RCC vs Steel Structure: Which is Better for Your Project?",
    slug: "rcc-vs-steel-structure",
    excerpt: "A comprehensive comparison of RCC and steel structure construction methods, covering cost, durability, construction time, and suitability for different building types.",
    content: "Detailed comparison...",
    coverImage: "https://images.unsplash.com/photo-1541888081691-1cb11354b670?auto=format&fit=crop&q=80",
    category: "Engineering",
    author: "Rupali Team",
    published: true,
    viewCount: 980,
    createdAt: new Date("2024-11-28"),
  },
  {
    id: 3,
    title: "Construction Timeline Breakdown: From Blueprint to Handover",
    slug: "construction-timeline-breakdown",
    excerpt: "Learn about the typical construction timeline for residential projects in Gurgaon. Understand each phase from foundation to finishing and how to plan accordingly.",
    content: "Timeline guide...",
    coverImage: "https://images.unsplash.com/photo-1504307651254-35680f35aa2e?auto=format&fit=crop&q=80",
    category: "Planning",
    author: "Rupali Team",
    published: true,
    viewCount: 1500,
    createdAt: new Date("2024-11-10"),
  },
  {
    id: 4,
    title: "Vastu Tips for Modern Home Construction",
    slug: "vastu-tips-modern-home",
    excerpt: "Integrate Vastu Shastra principles into your modern home design. Practical tips for room placement, entrance direction, and energy flow.",
    content: "Vastu guide...",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    category: "Design",
    author: "Rupali Team",
    published: true,
    viewCount: 2100,
    createdAt: new Date("2024-10-22"),
  },
  {
    id: 5,
    title: "Smart Home Integration in New Construction",
    slug: "smart-home-integration",
    excerpt: "How to plan for smart home technology during the construction phase. Wiring, automation systems, and future-proofing your home.",
    content: "Smart home guide...",
    coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80",
    category: "Technology",
    author: "Rupali Team",
    published: true,
    viewCount: 890,
    createdAt: new Date("2024-10-05"),
  },
  {
    id: 6,
    title: "Sustainable Construction Practices for Gurgaon Climate",
    slug: "sustainable-construction-gurgaon",
    excerpt: "Eco-friendly construction methods suited for Gurgaon's climate. Rainwater harvesting, solar integration, and energy-efficient design.",
    content: "Sustainability guide...",
    coverImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80",
    category: "Sustainability",
    author: "Rupali Team",
    published: true,
    viewCount: 760,
    createdAt: new Date("2024-09-18"),
  },
];
