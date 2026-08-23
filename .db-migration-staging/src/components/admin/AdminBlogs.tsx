import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, CheckCircle2, XCircle, FileText, Calendar, Eye, Trash2 } from "lucide-react";
import { BlogPost } from "@db/schema";

export default function AdminBlogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, refetch } = trpc.blog.adminList.useQuery({ limit: 50 });
  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const blogs = data?.items || [];
  
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePublish = async (blog: BlogPost) => {
    await updateMutation.mutateAsync({
      id: blog.id,
      published: !blog.published,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--rc-blue)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-[var(--rc-border)] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--rc-muted)]" />
          <input
            type="text"
            placeholder="Search blogs by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--rc-gray)] border-none focus:ring-2 focus:ring-[var(--rc-blue)] outline-none text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-[var(--rc-muted)]">
          <span>Total: {blogs.length}</span>
          <span className="w-1 h-1 bg-[var(--rc-border)] rounded-full"></span>
          <span>Published: {blogs.filter(b => b.published).length}</span>
          <span className="w-1 h-1 bg-[var(--rc-border)] rounded-full"></span>
          <span className="text-[var(--rc-orange)]">Pending: {blogs.filter(b => !b.published).length}</span>
        </div>
      </div>

      {/* Blogs List */}
      <div className="bg-white border border-[var(--rc-border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--rc-gray)] border-b border-[var(--rc-border)]">
                <th className="px-6 py-4 text-xs font-semibold text-[var(--rc-muted)] uppercase tracking-wider">Post Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--rc-muted)] uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--rc-muted)] uppercase tracking-wider">Date & Views</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--rc-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[var(--rc-muted)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rc-border)]">
              <AnimatePresence>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--rc-muted)]">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No blog posts found.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <motion.tr
                      key={blog.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-[var(--rc-gray)]/50 transition-colors group"
                    >
                      <td className="px-6 py-4 max-w-[300px]">
                        <div className="flex items-center gap-3">
                          {blog.coverImage ? (
                            <img src={blog.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[var(--rc-blue)]/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-[var(--rc-blue)]" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-[var(--rc-dark)] line-clamp-1">{blog.title}</p>
                            <p className="text-xs text-[var(--rc-muted)] line-clamp-1">{blog.excerpt || 'No excerpt provided'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--rc-dark)]">{blog.author || "Unknown"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs text-[var(--rc-muted)]">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {blog.viewCount} views</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {blog.published ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                            <Loader2 className="w-3 h-3 animate-spin" /> Pending Approval
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePublish(blog)}
                            disabled={updateMutation.isPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              blog.published 
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                                : "bg-[var(--rc-blue)] text-white hover:bg-[var(--rc-dark)] shadow-sm"
                            }`}
                          >
                            {blog.published ? "Unpublish" : "Approve & Publish"}
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 text-[var(--rc-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
