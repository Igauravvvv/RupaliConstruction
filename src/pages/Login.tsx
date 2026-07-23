/// <reference types="vite/client" />
import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, LogIn, UserPlus, Eye, EyeOff, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getGoogleAuthUrl() {
  return "/api/auth/google";
}

// Google "G" logo SVG
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function Login() {
  const { isAuthenticated, user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registeredUniqueId, setRegisteredUniqueId] = useState<string | null>(null);

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => setError(err.message),
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      setRegisteredUniqueId(data.uniqueId);
      // Don't redirect immediately — show the unique ID first
    },
    onError: (err) => setError(err.message),
  });

  if (isAuthenticated && !registeredUniqueId) {
    window.location.href = user?.role === "admin" ? "/admin" : "/";
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({
        username,
        password,
        displayName: displayName || undefined,
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  // Show success screen with unique ID after registration
  if (registeredUniqueId) {
    return (
      <div className="min-h-screen bg-[var(--rc-gray)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl border border-[var(--rc-border)] overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute top-0 left-0 w-full h-1.5" style={{
              background: "linear-gradient(90deg, #FF6B1A, #0B2E59, #FF6B1A)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }} />

            <div className="p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-2xl font-semibold text-[var(--rc-dark)] mb-2">
                Account Created! 🎉
              </h1>
              <p className="text-sm text-[var(--rc-muted)] mb-8">
                Your unique Rupali Construction ID
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-[var(--rc-blue)] to-[#1a4a7a] rounded-2xl p-6 mb-8"
              >
                <p className="text-xs text-blue-200 uppercase tracking-[0.2em] mb-2 font-medium">Your Unique ID</p>
                <p className="text-3xl font-bold text-white tracking-[0.15em] font-mono">
                  {registeredUniqueId}
                </p>
              </motion.div>

              <p className="text-xs text-[var(--rc-muted)] mb-6">
                Save this ID — you can use it to reference your account
              </p>

              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="w-full py-4 bg-[var(--rc-orange)] text-white rounded-xl font-medium hover:bg-[var(--rc-dark)] transition-all duration-300 shadow-lg shadow-[var(--rc-orange)]/20"
              >
                Continue to Dashboard →
              </button>
            </div>
          </div>
        </motion.div>

        <style>{`
          @keyframes shimmer {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 100% 0%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--rc-gray)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--rc-orange)]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--rc-blue)]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[var(--rc-orange)]/3 to-[var(--rc-blue)]/3 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--rc-muted)] hover:text-[var(--rc-orange)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 relative overflow-hidden">
            {/* Animated top accent */}
            <div className="absolute top-0 left-0 w-full h-1" style={{
              background: "linear-gradient(90deg, #FF6B1A, #0B2E59, #FF6B1A)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }} />

            {/* Header */}
            <div className="text-center mb-8">
              <img
                src="/logo-main.png?v=2"
                alt="Rupali Construction"
                className="h-20 md:h-24 w-auto mx-auto mb-6 object-contain mix-blend-multiply scale-[1.3] origin-center"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-semibold text-[var(--rc-dark)]">
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p className="text-sm text-[var(--rc-muted)] mt-2">
                    {mode === "login"
                      ? "Sign in to manage your projects"
                      : "Register for a new client portal account"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Google Sign-In Button */}
            <a
              href={getGoogleAuthUrl()}
              className="w-full py-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-[var(--rc-blue)] hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group mb-6"
            >
              <GoogleIcon />
              <span className="font-medium">
                Continue with Google
              </span>
            </a>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--rc-border)] to-transparent" />
              <span className="text-xs text-[var(--rc-muted)] uppercase tracking-[0.15em] font-medium">
                or {mode === "login" ? "sign in" : "register"} with password
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--rc-border)] to-transparent" />
            </div>

            {/* Admin badge for password login */}
            <div className="flex items-center gap-2 mb-5 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Shield className="w-4 h-4 text-[var(--rc-blue)] flex-shrink-0" />
              <p className="text-xs text-[var(--rc-blue)]">
                Password login is for <strong>administrators only</strong>
              </p>
            </div>

            {/* Username/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="text-sm font-medium text-[var(--rc-dark)] mb-2 block">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--rc-gray)] border border-[var(--rc-border)] rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-transparent outline-none transition-all"
                      placeholder="Your full name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-sm font-medium text-[var(--rc-dark)] mb-2 block">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--rc-gray)] border border-[var(--rc-border)] rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-transparent outline-none transition-all"
                  placeholder="your.username"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--rc-dark)] mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--rc-gray)] border border-[var(--rc-border)] rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-transparent outline-none transition-all pr-12"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--rc-muted)] hover:text-[var(--rc-dark)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-[var(--rc-orange)] text-white rounded-xl font-medium hover:bg-[var(--rc-dark)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-[var(--rc-orange)]/20 hover:shadow-xl"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Please wait...
                  </div>
                ) : mode === "login" ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Toggle login/register */}
            <p className="text-center text-sm text-[var(--rc-muted)] mt-8 pt-6 border-t border-[var(--rc-border)]">
              {mode === "login" ? (
                <>
                  Admin?{" "}
                  <button
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="text-[var(--rc-blue)] font-semibold hover:text-[var(--rc-orange)] transition-colors"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="text-[var(--rc-blue)] font-semibold hover:text-[var(--rc-orange)] transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
        }
      `}</style>
    </div>
  );
}
