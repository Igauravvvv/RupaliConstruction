import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * InitialLoader — A premium, cinematic intro loader that plays once on the
 * very first page load.  It shows the Rupali Construction logo with a subtle
 * shimmer + progress bar, then gracefully sweeps away with a curtain effect.
 */
export default function InitialLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Animate progress from 0 → 100 over ~1.8s
    let raf: number;
    const start = performance.now();
    const duration = 1200; // ms

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      // ease-out-quart for a smooth deceleration
      const eased = 1 - Math.pow(1 - pct, 4);
      setProgress(Math.round(eased * 100));

      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Small pause at 100 % before exit animation
        setTimeout(() => setIsDone(true), 200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isDone && (
        <motion.div
          key="initial-loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(160deg, #071F3D 0%, #0B2E59 50%, #0e3768 100%)" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Ambient floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4 + i * 3,
                height: 4 + i * 3,
                background: `rgba(255, 107, 26, ${0.15 + i * 0.04})`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 10, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Logo */}
          <motion.img
            src="/logo-main.webp?v=3"
            alt="Rupali Construction"
            className="w-48 sm:w-56 md:w-64 mb-8 drop-shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Progress bar */}
          <div className="relative w-56 sm:w-64 h-[3px] rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FF6B1A, #FF9A5C)",
              }}
              layout
              transition={{ ease: "easeOut", duration: 0.15 }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            className="mt-5 text-xs sm:text-sm tracking-[0.3em] uppercase text-white/50 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Crafting Architecture Into Reality
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
