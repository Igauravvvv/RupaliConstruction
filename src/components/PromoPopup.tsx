import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { X, Sparkles, ArrowRight } from "lucide-react";

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    if (hasDismissed) return;

    // Check if they dismissed it in a previous session
    if (sessionStorage.getItem("promo_dismissed")) {
      return;
    }

    let timePassed = false;
    let scrolledEnough = false;

    // Set a timer for 5 seconds
    const timer = setTimeout(() => {
      timePassed = true;
      checkAndShow();
    }, 5000);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        scrolledEnough = true;
        checkAndShow();
      }
    };

    const checkAndShow = () => {
      if (timePassed && scrolledEnough && !hasDismissed) {
        setIsVisible(true);
        // Remove scroll listener once shown
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasDismissed(true);
    sessionStorage.setItem("promo_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 400 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 400, transition: { duration: 0.3 } }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
            className="w-full max-w-md relative"
          >
            <div className="relative bg-[var(--rc-orange)] rounded-3xl p-8 shadow-2xl overflow-hidden group border border-white/20">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-2xl text-white">
                  Ready to build?
                </h3>
              </div>
              
              <p className="text-base text-white/90 mb-8 leading-relaxed">
                Start your dream construction journey with us today. Sign in to manage your project or get a free estimate.
              </p>

              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  onClick={handleDismiss}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white text-[var(--rc-orange)] rounded-xl font-bold hover:bg-[var(--rc-gray)] transition-all group/btn shadow-xl shadow-black/10"
                >
                  Sign In to Portal
                  <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/contact"
                  onClick={handleDismiss}
                  className="w-full flex items-center justify-center px-6 py-4 bg-transparent border-2 border-white/40 text-white rounded-xl font-bold hover:border-white hover:bg-white/10 transition-colors"
                >
                  Get a Free Estimate
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
