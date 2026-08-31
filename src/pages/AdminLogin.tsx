import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Shield, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

export default function AdminLogin() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: () => {
      window.location.href = "/admin";
    },
    onError: (err) => setError(err.message),
  });

  if (isAuthenticated) {
    window.location.href = user?.role === "admin" ? "/admin" : "/";
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ username, password });
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-600 rounded-xl bg-[#0f1b2e] text-white focus:border-[var(--rc-orange)] focus:ring-1 focus:ring-[var(--rc-orange)] focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#050c18] flex items-center justify-center p-4">
      <SEO title="Admin Login | Rupali Construction" noindex={true} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--rc-orange)]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Website</span>
        </Link>

        <div className="bg-[#0b1424] rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--rc-orange)] to-transparent" />
          
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--rc-orange)] to-orange-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white text-center">
                Admin Portal
              </h1>
              <p className="text-gray-400 text-sm mt-2 text-center">
                Secure login for Rupali Construction administrators
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClasses}
                  placeholder="Enter admin username"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full mt-2 py-3.5 bg-[var(--rc-orange)] hover:bg-orange-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
