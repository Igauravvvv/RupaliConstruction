import { Link } from "react-router";
import { MapPin, Phone, Mail, ArrowUp, ChevronRight, MessageSquare } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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

  return (
    <footer className="relative bg-[#05162D] text-white overflow-hidden border-t border-white/10 mt-auto">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-[var(--rc-blue)]/10 blur-[120px]" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[var(--rc-orange)]/5 blur-[100px]" />
        <img
          src="/logo-icon.png"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] object-contain opacity-[0.03] rotate-12"
        />
      </div>

      <div className="container-rc relative z-10 pt-8 md:pt-12 pb-6">
        {/* Desktop Footer - hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand & Speech Section */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl shadow-2xl relative group">
              <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              <img
                src="/logo-main.png?v=2"
                alt="Rupali Construction"
                className="w-64 md:w-80 object-contain relative z-10 brightness-[1.2]"
              />
            </Link>
            
            <TypingSpeechText text="Premium residential and commercial construction solutions engineered for quality, transparency, and timely delivery across Gurgaon and Delhi NCR." />
            
            <div className="flex gap-4 mt-8 ml-2">
              {["LinkedIn", "Instagram", "Facebook"].map((social, i) => (
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

          {/* Links Section */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-5 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[var(--rc-orange)]" />
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "Residential Construction",
                "Commercial Construction",
                "Renovation",
                "Interior Design",
                "Architectural Design",
                "Structural Engineering",
              ].map((service) => (
                <li key={service}><LinkItem href="/#services">{service}</LinkItem></li>
              ))}
            </ul>

            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-5 mt-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[var(--rc-orange)]" />
              Company
            </h4>
            <ul className="space-y-3">
              <li><LinkItem href="/" isRouterLink>Home</LinkItem></li>
              <li><LinkItem href="/blog" isRouterLink>Blog</LinkItem></li>
              <li><LinkItem href="/contact" isRouterLink>Contact</LinkItem></li>
              <li><LinkItem href="/#estimate">Get Estimate</LinkItem></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-5 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[var(--rc-orange)]" />
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--rc-orange)] group-hover:border-[var(--rc-orange)] transition-colors">
                  <MapPin className="w-4 h-4 text-white/70 group-hover:text-white" />
                </div>
                <span className="text-sm text-white/70 pt-1 leading-relaxed">
                  5th floor, M3M broadway,<br />Sector 71, Gurgaon
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--rc-orange)] group-hover:border-[var(--rc-orange)] transition-colors">
                  <Phone className="w-4 h-4 text-white/70 group-hover:text-white" />
                </div>
                <a href="tel:+919311830088" className="text-sm text-white/70 hover:text-white font-medium tracking-wide transition-colors">
                  +91 9311830088
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--rc-orange)] group-hover:border-[var(--rc-orange)] transition-colors">
                  <Mail className="w-4 h-4 text-white/70 group-hover:text-white" />
                </div>
                <a href="mailto:ujjwalt.rg@rupalihomes.com" className="text-sm text-white/70 hover:text-white font-medium tracking-wide transition-colors">
                  ujjwalt.rg@rupalihomes.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Footer - hidden on md+ */}
        <div className="md:hidden mb-6">
          {/* Logo - compact */}
          <div className="flex justify-center mb-4">
            <Link to="/" className="inline-block bg-white/5 border border-white/10 p-3 rounded-2xl">
              <img
                src="/logo-main.png?v=2"
                alt="Rupali Construction"
                className="w-40 object-contain brightness-[1.2]"
              />
            </Link>
          </div>

          {/* Tagline */}
          <p className="text-white/60 text-[11px] text-center leading-relaxed mb-4 px-2">
            Premium construction solutions engineered for quality, transparency, and timely delivery across Gurgaon and Delhi NCR.
          </p>

          {/* Contact Info - horizontal row */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <a href="tel:+919311830088" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 text-[11px] font-medium">
              <Phone className="w-3 h-3 text-[var(--rc-orange)]" />
              +91 9311830088
            </a>
            <a href="mailto:ujjwalt.rg@rupalihomes.com" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 text-[11px] font-medium">
              <Mail className="w-3 h-3 text-[var(--rc-orange)]" />
              Email Us
            </a>
          </div>

          {/* Address */}
          <div className="flex items-center justify-center gap-1.5 mb-5 text-white/50 text-[11px]">
            <MapPin className="w-3 h-3 text-[var(--rc-orange)]" />
            <span>5th floor, M3M Broadway, Sector 71, Gurgaon</span>
          </div>

          {/* Links - Horizontal flex wrap instead of vertical lists */}
          <div className="mb-6 px-2 space-y-4">
            <div>
              <h4 className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/30 mb-2 text-center">Services</h4>
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5">
                {[
                  "Residential",
                  "Commercial",
                  "Renovation",
                  "Interior Design",
                  "Architecture",
                  "Structural",
                ].map((s) => (
                  <a key={s} href="/#services" className="text-[10px] text-white/50 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{s}</a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/30 mb-2 text-center">Company</h4>
              <div className="flex flex-wrap justify-center gap-x-2 gap-y-1.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Projects", href: "/projects" },
                  { label: "Blog", href: "/blog" },
                  { label: "Contact", href: "/contact" },
                  { label: "Estimate", href: "/#estimate" },
                ].map((l) => (
                  <Link key={l.label} to={l.href} onClick={() => window.scrollTo(0, 0)} className="text-[10px] text-white/50 hover:text-white transition-colors bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{l.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* Social - horizontal */}
          <div className="flex items-center justify-center gap-5 mb-2">
            {["LinkedIn", "Instagram", "Facebook"].map((social) => (
              <a key={social} href="#" className="text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-[var(--rc-orange)] transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <p className="text-xs font-medium text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} Rupali Construction. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-[var(--rc-orange)] transition-colors"
          >
            Back to Top
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[var(--rc-orange)]/10 group-hover:border-[var(--rc-orange)]/30 transition-all group-hover:-translate-y-1">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
