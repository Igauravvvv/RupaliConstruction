import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const CombinedHero3D = lazy(() => import("@/components/CombinedHero3D"));

export default function Hero() {
  const [show3D, setShow3D] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const timer = window.setTimeout(() => setShow3D(true), 250);
    return () => window.clearTimeout(timer);
  }, []);
  return <section id="home-hero" className="relative isolate min-h-[900px] overflow-hidden bg-[#eaf1fc] pt-28 sm:min-h-[1040px] sm:pt-36 lg:flex lg:min-h-[max(800px,100svh)] lg:items-center lg:pb-44 lg:pt-28">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_24%,#ffffff_0%,transparent_62%),radial-gradient(ellipse_at_5%_80%,#bad0f3_0%,transparent_52%),radial-gradient(ellipse_at_100%_65%,#c5d8f6_0%,transparent_50%),linear-gradient(180deg,#f5f8ff_0%,#e8effc_55%,#d3e1f7_100%)]" />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.045]" style={{backgroundImage:"linear-gradient(#7291bf 1px,transparent 1px),linear-gradient(90deg,#7291bf 1px,transparent 1px)",backgroundSize:"80px 80px",maskImage:"linear-gradient(transparent 35%,black 100%)"}} />
    <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] w-full opacity-40" viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none"><defs><linearGradient id="hero-landscape" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b4c9ed" stopOpacity="0" /><stop offset="1" stopColor="#82a7df" stopOpacity="0.5" /></linearGradient></defs><path d="M0 180C200 80 340 260 580 210S1000 70 1440 170V400H0Z" fill="url(#hero-landscape)" /><path d="M0 280C280 170 450 340 760 260S1160 220 1440 280V400H0Z" fill="#a9c2e9" fillOpacity="0.3" /></svg>
    <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-12 h-[45%] w-full text-[#446ba3] opacity-[0.22] lg:inset-0 lg:h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="1">
      <ellipse cx="235" cy="630" rx="215" ry="78" transform="rotate(-22 235 630)" />
      <ellipse cx="1160" cy="670" rx="210" ry="76" transform="rotate(18 1160 670)" />
      <ellipse cx="720" cy="650" rx="660" ry="156" transform="rotate(-10 720 650)" strokeDasharray="5 10" strokeOpacity="0.6" />
    </svg>
    <div className="absolute inset-x-0 bottom-16 h-[450px] sm:bottom-12 sm:h-[430px] lg:inset-0 lg:h-full">{show3D && <Suspense fallback={null}><CombinedHero3D integrated /></Suspense>}</div>
    <motion.div initial={reduceMotion ? false : {opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="container-rc pointer-events-none relative z-20 mx-auto flex flex-col items-center text-center">
      <p className="mb-7 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#526886] sm:text-[10px]"><span className="h-px w-6 bg-[var(--rc-orange)]" />Gurugram · Since 2001<span className="h-px w-6 bg-[var(--rc-orange)]" /></p>
      <h1 className="font-serif text-[clamp(3.5rem,6.5vw,6.5rem)] sm:text-[clamp(4.5rem,7vw,6.5rem)] lg:text-[clamp(4.5rem,6.5vw,6.5rem)] leading-[0.98] tracking-[-0.045em] text-[var(--rc-blue)]">Built around<br /><span className="italic text-[var(--rc-orange)]">your life.</span></h1>
      <p className="mt-6 max-w-[290px] text-sm leading-relaxed text-[#5b6c86] sm:max-w-[350px] sm:text-base">Thoughtfully designed. Carefully constructed.<br className="hidden sm:block" /> Homes and spaces that feel like you.</p>
      <div className="pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link to="/contact" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--rc-blue)] px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-[#0b2e59]/20 transition-colors hover:bg-[#17477f]">Let’s Build Together<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
        <Link to="/projects" className="inline-flex min-h-12 items-center gap-2 px-3 py-3 text-xs font-semibold text-[var(--rc-blue)] underline decoration-[#0b2e59]/30 underline-offset-8 transition-colors hover:text-[var(--rc-orange)]">Explore Our Work<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </motion.div>
    <a href="#cinematic-reveal-section" className="absolute bottom-4 left-1/2 z-20 inline-flex min-h-6 -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.18em] text-[#526886] lg:bottom-5">From the ground up<ArrowDown className="h-3 w-3" aria-hidden="true" /></a>
  </section>;
}
