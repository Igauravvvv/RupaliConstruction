import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronDown, Activity, MapPin } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Hero3DBackground from "@/components/Hero3DBackground";
import Villa3D from "@/components/Villa3D";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const words = ["ARTS", "HOMES", "DREAMS", "ARCHITECTURE"];

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-transparent text-[var(--rc-text)] pt-20">
      {/* 3D Background - now positioned more to the right */}
      <Hero3DBackground />
      <Villa3D />

      <div className="relative z-10 container-rc w-full h-full flex items-center justify-center pointer-events-none">
          
          {/* Center Column: Typography & CTAs */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center text-center pointer-events-auto z-10 w-full max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--rc-blue)]/20 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-[var(--rc-orange)]/50 transition-all duration-300 cursor-default">
              <span className="w-2 h-2 rounded-full bg-[var(--rc-orange)] animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest text-[var(--rc-blue)] uppercase">
                Established Since 2001
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-6 w-full flex flex-col items-center justify-center relative z-10">
              <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.85)_0%,transparent_60%)] blur-2xl -z-10 rounded-full" />
              <h1 className="leading-[1.1] w-full relative flex flex-col items-center">
                
                {/* Crafting - Elegant Serif Neutral */}
                <motion.div className="flex justify-center items-center mb-1">
                  <motion.span 
                    className="text-5xl md:text-7xl lg:text-[6.5rem] font-serif italic text-[var(--rc-dark)] block tracking-tight leading-normal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    Crafting
                  </motion.span>
                </motion.div>

                {/* Looping Word - Premium Copper/Orange Shimmer */}
                <motion.div className="flex flex-col items-center justify-center relative my-2 z-20 h-[6rem] md:h-[8rem] lg:h-[10rem]">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={wordIndex}
                      className="text-6xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter text-transparent block leading-none px-4 drop-shadow-[0_4px_10px_rgba(240,113,43,0.2)] cursor-default"
                      style={{ WebkitTextStroke: "2px var(--rc-orange)", WebkitTextFillColor: "transparent" }}
                      initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
                      animate={{ 
                        y: 0, 
                        opacity: 1, 
                        filter: "blur(0px)"
                      }}
                      exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                      transition={{ 
                        y: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        filter: { duration: 0.2 }
                      }}
                      whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(240,113,43,0.5)" }}
                    >
                      {words[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                  {/* Very soft glow, not overpowering */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[60%] bg-[var(--rc-orange)]/10 -z-10 blur-3xl rounded-full"
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Into Reality - Minimalist Light Sans */}
                <motion.div className="flex justify-center items-center mt-3">
                  <motion.span 
                    className="text-3xl md:text-5xl lg:text-[4rem] font-light tracking-wide text-[var(--rc-text)]/80 block"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  >
                    Into Reality
                  </motion.span>
                </motion.div>

              </h1>
            </motion.div>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[var(--rc-text)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium text-center">
              Building legacies with engineering precision.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link
                to="/contact"
                className="group relative px-8 py-4 bg-[var(--rc-blue)] text-white font-bold rounded-full hover:bg-[var(--rc-dark)] shadow-[0_0_20px_rgba(11,36,71,0.3)] hover:shadow-[0_0_30px_rgba(240,113,43,0.4)] focus:ring-2 focus:ring-offset-2 focus:ring-[var(--rc-orange)] focus:outline-none transition-all duration-300 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase text-xs">
                  Start a Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-[var(--rc-orange)] transition-all" />
                </span>
              </Link>
              
              <Link
                to="/projects"
                className="group px-6 py-4 bg-transparent text-[var(--rc-text)] font-bold hover:text-[var(--rc-orange)] focus:outline-none transition-colors inline-flex items-center gap-2 tracking-widest uppercase text-xs relative"
              >
                View Portfolio
                <span className="absolute bottom-2 left-6 right-6 h-[1px] bg-[var(--rc-text)]/20 group-hover:bg-[var(--rc-orange)] group-hover:w-auto transition-all duration-300"></span>
              </Link>
            </motion.div>
          </motion.div>

      </div>

      <div className="absolute bottom-6 left-0 right-0 w-full flex justify-center pointer-events-none z-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1, type: "spring" }}
          className="flex flex-col items-center gap-2 pointer-events-auto cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
        <span className="text-xs uppercase tracking-[0.25em] font-bold text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)] transition-colors duration-300 animate-pulse">Scroll to explore</span>
        <div className="flex flex-col items-center">
          <div className="w-7 h-11 border-2 border-[var(--rc-blue)] group-hover:border-[var(--rc-orange)] rounded-full flex justify-center p-1 transition-colors duration-300 bg-white/40 backdrop-blur-sm shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
             <motion.div
                animate={{ y: [0, 18, 0], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1.5 h-3 bg-[var(--rc-orange)] rounded-full shadow-[0_0_8px_rgba(240,113,43,0.8)]"
             />
          </div>
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.1 }}
            className="mt-1"
          >
            <ChevronDown className="w-5 h-5 text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)] transition-colors" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
            className="-mt-3"
          >
            <ChevronDown className="w-5 h-5 text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)] transition-colors" />
          </motion.div>
        </div>
      </motion.div>
    </div>
    </section>
  );
}
