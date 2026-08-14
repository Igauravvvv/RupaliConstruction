import React, { useState } from "react";
import { uploadImageFile } from "@/lib/upload";
import { trpc } from "@/providers/trpc";
import { X, Upload, Loader2, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubmitBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitBlogModal({ isOpen, onClose }: SubmitBlogModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    excerpt: "",
    content: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const submitMutation = trpc.blog.submit.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    try {
      let coverImage = "";

      if (file) {
        coverImage = await uploadImageFile(file);
      }

      await submitMutation.mutateAsync({
        title: formData.title,
        author: formData.author,
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ title: "", author: "", category: "", excerpt: "", content: "" });
        setFile(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your blog post.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-10"
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[var(--rc-border)] p-4 flex items-center justify-between z-20">
              <h2 className="text-xl font-bold text-[var(--rc-dark)]">Submit a Blog Post</h2>
              <button
                onClick={onClose}
                className="p-2 text-[var(--rc-muted)] hover:text-[var(--rc-dark)] hover:bg-[var(--rc-gray)] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[var(--rc-dark)] mb-2">Submitted Successfully!</h3>
                  <p className="text-[var(--rc-muted)]">
                    Thank you for your submission. Our team will review your post before it appears on the main page.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--rc-dark)] mb-1.5">Post Title *</label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-blue)] focus:ring-2 focus:ring-[var(--rc-blue)]/20 outline-none transition-all"
                        placeholder="E.g., Top 10 Construction Tips"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--rc-dark)] mb-1.5">Author Name</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-blue)] focus:ring-2 focus:ring-[var(--rc-blue)]/20 outline-none transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--rc-dark)] mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-blue)] focus:ring-2 focus:ring-[var(--rc-blue)]/20 outline-none transition-all"
                    >
                      <option value="">Select a category</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Construction">Construction</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Cost Guide">Cost Guide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--rc-dark)] mb-1.5">Short Excerpt (Optional)</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-blue)] focus:ring-2 focus:ring-[var(--rc-blue)]/20 outline-none transition-all resize-none"
                      placeholder="A brief summary of your post..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--rc-dark)] mb-1.5">Full Content *</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-blue)] focus:ring-2 focus:ring-[var(--rc-blue)]/20 outline-none transition-all"
                      placeholder="Write your article here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--rc-dark)] mb-1.5">Cover Image</label>
                    <div className="relative border-2 border-dashed border-[var(--rc-border)] rounded-xl p-6 text-center hover:bg-[var(--rc-gray)] transition-colors cursor-pointer overflow-hidden group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-[var(--rc-blue)] font-medium">
                          <CheckCircle className="w-4 h-4" />
                          {file.name}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[var(--rc-blue)]/10 text-[var(--rc-blue)] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-sm text-[var(--rc-muted)]">Click or drag an image to upload</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-[var(--rc-border)]">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl font-semibold text-[var(--rc-dark)] hover:bg-[var(--rc-gray)] transition-colors"
                      disabled={isUploading || submitMutation.isPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || submitMutation.isPending}
                      className="px-6 py-2.5 rounded-xl font-semibold text-white bg-[var(--rc-blue)] hover:bg-[var(--rc-dark)] shadow-[0_4px_10px_rgba(11,36,71,0.2)] hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                      {(isUploading || submitMutation.isPending) ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Post"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
