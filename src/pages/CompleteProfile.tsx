import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CompleteProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      utils.invalidate().then(() => {
        navigate("/");
      });
    },
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!isLoading && user?.phoneNumber) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || user?.phoneNumber) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    updateProfile.mutate({ phoneNumber });
  };

  return (
    <div className="min-h-screen bg-[var(--rc-gray)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-[var(--rc-orange)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--rc-dark)]">Almost there!</h1>
            <p className="text-sm text-[var(--rc-muted)] mt-2">
              Please provide your phone number to complete your profile and access all features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--rc-dark)] mb-2 block">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-transparent outline-none transition-all"
                placeholder="+91 9999999999"
              />
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
              disabled={updateProfile.isPending}
              className="w-full py-4 bg-[var(--rc-orange)] text-white rounded-xl font-medium hover:bg-[var(--rc-dark)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {updateProfile.isPending ? "Saving..." : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Complete Profile
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
