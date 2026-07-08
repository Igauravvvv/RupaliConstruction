import { Link } from "react-router";
import { ArrowRight, ChevronDown, Activity, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-transparent text-[var(--rc-text)] pt-20">
      {/* 3D Background - now positioned more to the right */}
      <Hero3DBackground />
      <Villa3D />

      <div className="relative z-10 container-rc w-full pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          
          {/* Right Column: Typography & CTAs (Shifted to right) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 lg:col-start-7 2xl:col-span-5 2xl:col-start-8 pointer-events-auto z-10"
          >
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <span className="w-12 h-[2px] bg-[var(--rc-orange)]"></span>
              <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-[var(--rc-orange)] uppercase">
                Est. 2001
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-6">
              <h1 className="leading-[1.1]">
                <span className="text-6xl md:text-8xl lg:text-[7rem] font-serif italic text-[var(--rc-orange)] block drop-shadow-sm transform -translate-x-2">
                  Crafting
                </span>
                <span className="text-5xl md:text-7xl lg:text-7xl font-black uppercase tracking-tighter text-[var(--rc-blue)] block mt-2">
                  Dreams
                </span>
                <span className="text-4xl md:text-6xl font-light tracking-tight text-[var(--rc-text)]/80 block mt-2">
                  Into Reality
                </span>
              </h1>
            </motion.div>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-[var(--rc-text)]/70 max-w-lg mb-10 leading-relaxed font-medium">
              Whether it's your perfect home, a strategic commercial space, or a legacy investment—we merge architectural brilliance with engineering precision.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                to="/contact"
                className="group relative px-8 py-4 bg-[var(--rc-blue)] text-white font-bold rounded-full hover:bg-[var(--rc-dark)] hover:shadow-2xl hover:shadow-blue-900/20 focus:ring-2 focus:ring-offset-2 focus:ring-[var(--rc-blue)] focus:outline-none transition-all flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase text-xs">
                  Start a Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                to="/projects"
                className="group px-6 py-4 bg-transparent text-[var(--rc-text)] font-bold hover:text-[var(--rc-orange)] focus:outline-none transition-colors inline-flex items-center gap-2 tracking-widest uppercase text-xs relative"
              >
                View Portfolio
                <span className="absolute bottom-2 left-6 right-6 h-[1px] bg-[var(--rc-text)]/20 group-hover:bg-[var(--rc-orange)] transition-colors"></span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Left Column: Floating UI Data Cards (Shifted to left) */}
          <div className="hidden lg:block lg:col-span-6 lg:col-start-1 lg:row-start-1 relative h-[600px] pointer-events-none z-20">
            {/* Floating Card 1 */}
            <motion.div 
              style={{ y: y1 }}
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              className="absolute top-10 left-10 bg-white/80 backdrop-blur-md border border-[var(--rc-blue)]/10 p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[240px]"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--rc-blue)]/10 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-[var(--rc-blue)]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--rc-text)]/50 font-bold mb-1">Live Tracking</p>
                <p className="text-sm font-bold text-[var(--rc-text)] leading-tight">12+ Projects currently in construction phase</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              style={{ y: y2 }}
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              className="absolute bottom-20 right-10 bg-white/80 backdrop-blur-md border border-[var(--rc-orange)]/20 p-4 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[200px]"
            >
              <div className="flex items-center justify-between border-b border-[var(--rc-text)]/5 pb-2">
                 <span className="text-[10px] uppercase tracking-widest text-[var(--rc-text)]/50 font-bold">Site Alpha</span>
                 <MapPin className="w-3 h-3 text-[var(--rc-orange)]" />
              </div>
              <div className="flex justify-between items-end mt-1">
                <span className="text-2xl font-black text-[var(--rc-blue)]">98%</span>
                <span className="text-xs font-medium text-[var(--rc-text)]/60">Completion</span>
              </div>
              <div className="w-full h-1 bg-[var(--rc-gray)] rounded-full overflow-hidden mt-1">
                <div className="h-full bg-[var(--rc-orange)] w-[98%]"></div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--rc-blue)]/60 flex flex-col items-center gap-2 animate-bounce pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll to explore</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
}
