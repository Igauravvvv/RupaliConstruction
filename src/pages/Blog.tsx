import { fallbackPosts } from "../../shared/blog-content";
export { fallbackPosts } from "../../shared/blog-content";
import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { Calendar, Clock, ArrowRight, PenLine } from "lucide-react";
import SEO from "@/components/SEO";
import SubmitBlogModal from "@/components/SubmitBlogModal";

export default function Blog() {
  const { data, isLoading, refetch } = trpc.blog.list.useQuery({ limit: 12 });
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const posts = data?.items?.length ? data.items : fallbackPosts;

  return (
    <div className="min-h-screen relative bg-[var(--rc-white)]">
      <SEO
        title="Construction Insights & Architecture Blog | Rupali Construction"
        description="Read expert insights, cost estimation guides, luxury building advice, interior trends, and real estate market updates in Gurugram from Rupali Construction."
        keywords="construction blog Gurgaon, home building tips Gurgaon, architecture news NCR, luxury construction cost estimating, real estate advice Haryana"
        url="/blog"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Construction & Architecture Insights",
            "description": "Expert insights, construction tips, and industry updates from Rupali Construction."
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rupaliconstruction.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://rupaliconstruction.com/blog"
              }
            ]
          }
        ]}
      />
      <Navbar />

      {/* Full Page Background Image */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1920&q=80"
          alt="Construction Planning and Blog"
          className="w-full h-full object-cover object-[center_20%] opacity-[0.15] mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--rc-white)]/30 to-[var(--rc-white)]/90" />
      </div>

      <section className="pt-32 pb-16 relative z-10">
        <div className="container-rc">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="group w-full md:w-auto justify-center px-8 py-4 rounded-full font-bold text-base text-white bg-gradient-to-r from-[var(--rc-orange)] to-orange-500 border-2 border-white/50 hover:border-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-400 shadow-[0_0_15px_rgba(240,113,43,0.5)] hover:shadow-[0_0_30px_rgba(240,113,43,0.8)] active:scale-95 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 md:mb-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <PenLine className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Write a Post</span>
            </button>
          </div>
        </div>
      </section>

      <SubmitBlogModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          refetch();
        }}
      />

      <section className="py-16 lg:py-24 relative z-10">
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
                      <img loading="lazy" src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
