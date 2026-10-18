import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { ArrowLeft, Calendar, User, Clock, ArrowRight, Calculator, PhoneCall, ShieldCheck } from "lucide-react";
import { fallbackPosts } from "./Blog";
import SEO from "@/components/SEO";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: dbPost, isLoading } = trpc.blog.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const post: any = dbPost || fallbackPosts.find(p => p.slug === slug);

  return (
    <div className="min-h-screen relative">
      {post && (
        <SEO 
          title={`${post.title} | Construction Insights | Rupali Construction`}
          description={post.excerpt || (post.content && post.content.substring(0, 160)) || "Read expert construction and architecture insights from Rupali Construction."}
          keywords={`${post.category || 'construction'}, blog, Gurgaon, construction insights, architecture`}
          image={post.coverImage || "https://rupaliconstruction.com/logo-main.webp"}
          url={`/blog/${post.slug || slug}`}
          type="article"
          schema={[
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "image": [post.coverImage || "https://rupaliconstruction.com/logo-main.webp"],
              "datePublished": post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
              "author": {
                "@type": "Organization",
                "name": post.author || "Rupali Construction Team"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Rupali Construction",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://rupaliconstruction.com/logo-main.webp"
                }
              },
              "description": post.excerpt || "Expert construction insights."
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
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": post.title,
                  "item": `https://rupaliconstruction.com/blog/${post.slug || slug}`
                }
              ]
            }
          ]}
        />
      )}
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
        <div className="container-rc max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--rc-muted)] hover:text-[var(--rc-blue)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-[var(--rc-blue)]/10 rounded w-3/4" />
              <div className="h-4 bg-[var(--rc-blue)]/10 rounded w-1/2" />
            </div>
          ) : post ? (
            <>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--rc-muted)] mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author || "Rupali Team"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.viewCount} views
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-[var(--rc-dark)] mb-6">
                {post.title}
              </h1>

              {post.category && (
                <span className="inline-block px-3 py-1 bg-[var(--rc-orange)]/10 text-[var(--rc-orange)] text-sm font-medium rounded-full mb-8">
                  {post.category}
                </span>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h1 className="text-2xl font-semibold text-[var(--rc-dark)] mb-2">
                Article not found
              </h1>
              <p className="text-[var(--rc-muted)]">
                The article you're looking for doesn't exist.
              </p>
            </div>
          )}
        </div>
      </section>

      {post && (
        <section className="py-16 bg-[var(--rc-white)] relative z-10">
          <div className="container-rc max-w-4xl">
            <div className="prose prose-lg max-w-none text-[var(--rc-dark)]">
              {post.excerpt && (
                <p className="text-xl text-[var(--rc-muted)] leading-relaxed mb-8 font-serif italic border-l-4 border-[var(--rc-orange)] pl-4">
                  {post.excerpt}
                </p>
              )}
              <div className="whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
                {post.content}
              </div>
            </div>

            {/* In-Article Conversion & Cost Estimation CTA Card */}
            <div className="my-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#071F3D] to-[#0B2E59] text-white shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--rc-orange)]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[var(--rc-orange)] text-xs font-bold tracking-wider uppercase mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  Turnkey House Construction in Gurgaon
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-white">
                  Planning to Build or Renovate Your Villa in Gurgaon?
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
                  Get a comprehensive, zero-deviation Bill of Quantities (BoQ) with verified material brands, seismic zone IV calculations, and fixed milestone pricing from our senior civil engineers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/#estimate"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--rc-orange)] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm shadow-lg shadow-orange-500/20"
                  >
                    <Calculator className="w-4 h-4" />
                    Calculate Construction Cost
                  </Link>
                  <a
                    href="https://wa.me/919311830088?text=Hello%20Rupali%20Construction,%20I%20read%20your%20guide%20and%20want%20to%20discuss%20my%20independent%20house%20construction%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm border border-white/15 backdrop-blur-sm"
                  >
                    <PhoneCall className="w-4 h-4 text-green-400" />
                    WhatsApp Us (+91 93118 30088)
                  </a>
                </div>
              </div>
            </div>

            {/* Author & Editorial Authority Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F9FA] border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-5 my-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--rc-blue)] text-white flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0 shadow-md">
                RC
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-[var(--rc-dark)] text-base">
                  Rupali Construction Engineering Studio
                </h4>
                <p className="text-xs text-[var(--rc-orange)] font-semibold uppercase tracking-wider mb-2">
                  Civil Engineers & Licensed Structural Architects • Sector 71, Gurugram
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Published and reviewed by our senior civil and structural engineering team. Bringing over 35+ years of combined structural construction mastery, DTCP municipal approval expertise, and luxury villa deliveries across Gurugram, DLF, and Delhi NCR.
                </p>
              </div>
            </div>

            {/* Contextual Internal Links to Core Services */}
            <div className="mt-10 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">
                Explore Related Construction Services
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                <Link
                  to="/services/residential-construction"
                  className="p-3.5 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-[var(--rc-orange)] transition-colors text-xs font-medium text-gray-700 flex items-center justify-between group"
                >
                  <span>Residential Construction</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--rc-orange)] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  to="/services/architectural-design"
                  className="p-3.5 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-[var(--rc-orange)] transition-colors text-xs font-medium text-gray-700 flex items-center justify-between group"
                >
                  <span>Architectural & Vastu Design</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--rc-orange)] group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  to="/services/structural-engineering"
                  className="p-3.5 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-[var(--rc-orange)] transition-colors text-xs font-medium text-gray-700 flex items-center justify-between group"
                >
                  <span>Structural Engineering</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--rc-orange)] group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

            {post.tags && (
              <div className="mt-10 pt-6 border-t border-[var(--rc-border)]">
                <p className="text-label text-[var(--rc-muted)] mb-3">Topic Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(",").map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--rc-gray)] text-[var(--rc-dark)] text-xs rounded-full font-medium"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
