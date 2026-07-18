import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 80);
      
      const darkSections = document.querySelectorAll('.dark-nav-trigger, #cinematic-reveal-section');
      let isDark = false;
      
      // The Brand Standards page starts with a dark hero section
      if (location.pathname === '/brand-standards' && currentScrollY < 500) {
        isDark = true;
      }
      
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
          isDark = true;
        }
      });
      setIsDarkSection(isDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Check on route change after DOM paints
    const timer = setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Leadership", href: "/leadership" },
    { label: "Brand Standards", href: "/brand-standards" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const navBgClass = isDarkSection
    ? "bg-[var(--rc-blue)]/90 backdrop-blur-xl shadow-lg border-b border-white/10"
    : scrolled
    ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)]"
    : "bg-transparent";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBgClass}`}>
      <div className="container-rc flex items-center justify-between h-20 lg:h-24">
        <Link 
          to="/" 
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center py-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo-main.png?v=2"
            alt="Rupali Construction"
            className={`h-20 md:h-24 lg:h-32 w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left translate-y-2 lg:translate-y-4 transition-all duration-500 ${
              isDarkSection ? "drop-shadow-lg" : "mix-blend-multiply"
            }`}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            
            const textColor = isDarkSection 
              ? (isActive ? "text-[var(--rc-orange)]" : "text-white/90 hover:text-[var(--rc-orange)]")
              : (isActive ? "text-[var(--rc-blue)]" : "text-[var(--rc-text)] hover:text-[var(--rc-blue)]");
              
            const underlineColor = isDarkSection ? "bg-white" : "bg-[var(--rc-orange)]";

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => window.scrollTo(0, 0)}
                className={`text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 relative group ${textColor}`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-0 w-full h-[2px] ${underlineColor} transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/contact"
            className={`px-8 py-3 text-sm font-bold tracking-wider uppercase rounded-full transition-all duration-300 shadow-lg ${
              isDarkSection 
                ? "bg-white text-[var(--rc-blue)] hover:bg-[var(--rc-orange)] hover:text-white shadow-white/10"
                : "bg-[var(--rc-orange)] text-white hover:bg-[var(--rc-dark)] shadow-orange-500/20"
            }`}
          >
            Get Estimate
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2"
        >
          {mobileOpen ? (
            <X className={`w-6 h-6 ${isDarkSection ? "text-white" : "text-[var(--rc-blue)]"}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isDarkSection ? "text-white" : "text-[var(--rc-blue)]"}`} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className={`md:hidden absolute w-full border-t ${isDarkSection ? "bg-[var(--rc-blue)] border-white/10" : "bg-white border-[var(--rc-border)]"}`}>
          <nav className="container-rc py-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-base font-bold uppercase tracking-[0.2em] transition-colors ${
                  isDarkSection ? "text-white/90 hover:text-[var(--rc-orange)]" : "text-[var(--rc-text)] hover:text-[var(--rc-blue)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className={`pt-6 flex flex-col gap-3 border-t ${isDarkSection ? "border-white/10" : "border-[var(--rc-border)]"}`}>
              <Link
                to="/contact"
                className={`px-6 py-4 text-sm font-bold tracking-widest uppercase rounded-full text-center ${
                  isDarkSection 
                    ? "bg-white text-[var(--rc-blue)]" 
                    : "bg-[var(--rc-orange)] text-white"
                }`}
              >
                Get Estimate
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
