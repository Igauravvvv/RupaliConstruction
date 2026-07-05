import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = trpc.blog.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 bg-[var(--rc-gray)]">
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
        <section className="py-16 bg-[var(--rc-white)]">
          <div className="container-rc max-w-4xl">
            <div className="prose prose-lg max-w-none text-[var(--rc-dark)]">
              {post.excerpt && (
                <p className="text-xl text-[var(--rc-muted)] leading-relaxed mb-8 font-serif italic">
                  {post.excerpt}
                </p>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>

            {post.tags && (
              <div className="mt-12 pt-8 border-t border-[var(--rc-border)]">
                <p className="text-label text-[var(--rc-muted)] mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--rc-gray)] text-[var(--rc-dark)] text-sm rounded-full"
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
