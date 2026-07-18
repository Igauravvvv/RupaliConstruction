/// <reference types="vite/client" />
import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

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
      window.location.href = "/";
    },
    onError: (err) => setError(err.message),
  });

  if (isAuthenticated) {
    window.location.href = "/";
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

  return (
    <div className="min-h-screen bg-[var(--rc-gray)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--rc-muted)] hover:text-[var(--rc-orange)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-[var(--rc-border)] p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-blue)]" />
          
          <div className="text-center mb-8">
            <img
              src="/logo-main.png?v=2"
              alt="Rupali Construction"
              className="h-14 w-auto mx-auto mb-6 object-contain mix-blend-multiply"
            />
            <h1 className="text-2xl font-semibold text-[var(--rc-dark)]">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-[var(--rc-muted)] mt-2">
              {mode === "login"
                ? "Sign in to manage your projects"
                : "Register for a new client portal account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
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
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-[var(--rc-dark)] mb-2 block">
                Username *
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
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--rc-gray)] border border-[var(--rc-border)] rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-[var(--rc-orange)] text-white rounded-xl font-medium hover:bg-[var(--rc-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-[var(--rc-orange)]/20"
            >
              {isPending ? (
                "Please wait..."
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

          <p className="text-center text-sm text-[var(--rc-muted)] mt-8 pt-6 border-t border-[var(--rc-border)]">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
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
      </div>
    </div>
  );
}
