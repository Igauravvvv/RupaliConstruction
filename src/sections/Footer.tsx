import { Link } from "react-router";
import { MapPin, Phone, Mail, ArrowUp, ChevronRight, MessageSquare, Plus, Minus } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const TypingSpeechText = ({ text }: { text: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (isInView) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }
  }, [isInView, text]);

  return (
    <div ref={ref} className="relative mt-6 z-20">
      <div className="absolute -left-2 -top-3 w-6 h-6 text-[var(--rc-orange)] transform -scale-x-100">
        <MessageSquare className="w-full h-full fill-current opacity-80" />
      </div>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl rounded-tl-none shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
          "{displayedText}"
          {isInView && displayedText.length < text.length && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-[var(--rc-orange)] animate-pulse align-middle" />
          )}
        </p>
      </div>
    </div>
  );
};

const LinkItem = ({ href, children, isRouterLink = false }: { href: string, children: React.ReactNode, isRouterLink?: boolean }) => {
  const className = "group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-all duration-300 w-fit";
  const content = (
    <>
      <ChevronRight className="w-3 h-3 text-[var(--rc-orange)] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      <span className="group-hover:translate-x-1 transition-transform duration-300">{children}</span>
    </>
  );

  return isRouterLink ? (
    <Link to={href} className={className} onClick={() => window.scrollTo(0, 0)}>{content}</Link>
  ) : (
    <a href={href} className={className}>{content}</a>
  );
};

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(prev => prev === section ? null : section);
  };

  return (
    <footer className="relative bg-[#05162D] text-white overflow-hidden mt-auto border-t border-white/10 shadow-[0_-10px_40px_rgba(5,22,45,0.8)]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--rc-orange)]/30 to-transparent" />
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-[var(--rc-blue)]/10 blur-[120px]" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[var(--rc-orange)]/5 blur-[100px]" />
        <img
          src="/logo-icon.png"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] object-contain opacity-[0.03] rotate-12"
        />
      </div>

      <div className="container-rc relative z-10 pt-10 md:pt-16 pb-6">
        
        {/* =========================================
            DESKTOP FOOTER (hidden on mobile)
            ========================================= */}
        <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Column 1: Brand & Speech */}
          <div className="md:col-span-12 lg:col-span-4">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl shadow-2xl relative group">
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <img
                src="/logo-main.png?v=2"
                alt="Rupali Construction"
                className="w-56 object-contain relative z-10 brightness-[1.2]"
              />
            </Link>
            
            <TypingSpeechText text="Premium residential and commercial construction solutions engineered for quality, transparency, and timely delivery across Gurgaon and Delhi NCR." />
            
            <div className="flex gap-4 mt-8 ml-2">
              {["LinkedIn", "Instagram", "Facebook"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -3, color: "var(--rc-orange)" }}
                  className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[var(--rc-orange)]" />
              Services
            </h4>
            <ul className="space-y-4">
              {[
                "Residential",
                "Commercial",
                "Renovation",
                "Interior Design",
                "Architecture",
                "Structural",
              ].map((service) => (
                <li key={service}><LinkItem href="/#services">{service}</LinkItem></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[var(--rc-orange)]" />
              Company
            </h4>
            <ul className="space-y-4">
              <li><LinkItem href="/" isRouterLink>Home</LinkItem></li>
              <li><LinkItem href="/projects" isRouterLink>Projects</LinkItem></li>
              <li><LinkItem href="/blog" isRouterLink>Blog</LinkItem></li>
              <li><LinkItem href="/contact" isRouterLink>Contact</LinkItem></li>
              <li><LinkItem href="/#estimate">Get Estimate</LinkItem></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-[var(--rc-orange)]" />
              Contact
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--rc-orange)] group-hover:border-[var(--rc-orange)] transition-all group-hover:scale-110">
                  <MapPin className="w-4 h-4 text-white/70 group-hover:text-white" />
                </div>
                <span className="text-sm text-white/70 pt-1 leading-relaxed">
                  5th floor, M3M broadway,<br />Sector 71, Gurgaon
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--rc-orange)] group-hover:border-[var(--rc-orange)] transition-all group-hover:scale-110">
                  <Phone className="w-4 h-4 text-white/70 group-hover:text-white" />
                </div>
                <a href="tel:+919311830088" className="text-sm text-white/70 hover:text-white font-medium tracking-wide transition-colors">
                  +91 9311830088
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--rc-orange)] group-hover:border-[var(--rc-orange)] transition-all group-hover:scale-110">
                  <Mail className="w-4 h-4 text-white/70 group-hover:text-white" />
                </div>
                <a href="mailto:ujjwalt.rg@rupalihomes.com" className="text-sm text-white/70 hover:text-white font-medium tracking-wide transition-colors">
                  ujjwalt.rg@rupalihomes.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================
            MOBILE FOOTER (hidden on md+)
            ========================================= */}
        <div className="md:hidden flex flex-col mb-6">
          
          {/* Top Row: Logo & Quick Contact */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <Link to="/" className="inline-block bg-white/5 border border-white/10 p-2 rounded-xl">
              <img
                src="/logo-main.png?v=2"
                alt="Rupali Construction"
                className="w-32 object-contain brightness-[1.2]"
              />
            </Link>
            
            <div className="flex gap-3">
              <a href="tel:+919311830088" className="w-10 h-10 rounded-full bg-[var(--rc-orange)] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,102,0,0.4)] active:scale-95 transition-transform">
                <Phone className="w-4 h-4" />
              </a>
              <a href="mailto:ujjwalt.rg@rupalihomes.com" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white active:scale-95 transition-transform">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Accordion Links */}
          <div className="space-y-2 mb-8">
            {/* Services Accordion */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button 
                onClick={() => toggleAccordion("services")}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-white/80">Services</span>
                {activeAccordion === "services" ? <Minus className="w-4 h-4 text-[var(--rc-orange)]" /> : <Plus className="w-4 h-4 text-white/50" />}
              </button>
              <AnimatePresence>
                {activeAccordion === "services" && (
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: "auto" }} 
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-4 px-4 space-y-3">
                      {["Residential", "Commercial", "Renovation", "Interior Design", "Architecture", "Structural"].map((service) => (
                        <li key={service}><LinkItem href="/#services">{service}</LinkItem></li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company Accordion */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button 
                onClick={() => toggleAccordion("company")}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-white/80">Company</span>
                {activeAccordion === "company" ? <Minus className="w-4 h-4 text-[var(--rc-orange)]" /> : <Plus className="w-4 h-4 text-white/50" />}
              </button>
              <AnimatePresence>
                {activeAccordion === "company" && (
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: "auto" }} 
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-4 px-4 space-y-3">
                      <li><LinkItem href="/" isRouterLink>Home</LinkItem></li>
                      <li><LinkItem href="/projects" isRouterLink>Projects</LinkItem></li>
                      <li><LinkItem href="/blog" isRouterLink>Blog</LinkItem></li>
                      <li><LinkItem href="/contact" isRouterLink>Contact</LinkItem></li>
                      <li><LinkItem href="/#estimate">Get Estimate</LinkItem></li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Social Icons & Address */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex gap-6">
              {["LinkedIn", "Instagram", "Facebook"].map((social) => (
                <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[var(--rc-orange)] transition-colors">
                  {social}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
              <MapPin className="w-3 h-3 text-[var(--rc-orange)]" />
              <span>5th floor, M3M Broadway, Sector 71, Gurgaon</span>
            </div>
          </div>
          
        </div>

        {/* =========================================
            BOTTOM BAR (Shared)
            ========================================= */}
        <div className="border-t border-white/10 pt-6 flex flex-row items-center justify-between relative">
          <p className="text-[10px] md:text-xs font-medium text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} Rupali Construction.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[var(--rc-orange)] transition-colors"
          >
            Top
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--rc-orange)]/10 group-hover:border-[var(--rc-orange)]/30 transition-all group-hover:-translate-y-1">
              <ArrowUp className="w-3 h-3 md:w-4 md:h-4" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}
