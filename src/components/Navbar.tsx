import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Leadership", href: "/leadership" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-rc flex items-center justify-between h-20 lg:h-24">
        <Link 
          to="/" 
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center py-2 hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo-main.png"
            alt="Rupali Construction"
            className="h-20 md:h-24 lg:h-32 w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left translate-y-2 lg:translate-y-4 transition-all duration-500 mix-blend-multiply"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => window.scrollTo(0, 0)}
                className={`text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 relative group ${
                  isActive ? "text-[var(--rc-blue)]" : "text-[var(--rc-text)] hover:text-[var(--rc-blue)]"
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-0 w-full h-[2px] bg-[var(--rc-orange)] transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/contact"
            className="px-8 py-3 text-sm font-bold tracking-wider uppercase rounded-full transition-all duration-300 bg-[var(--rc-orange)] text-white hover:bg-[var(--rc-dark)] hover:scale-105 shadow-lg shadow-orange-500/20"
          >
            Get Estimate
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-[var(--rc-blue)]" />
          ) : (
            <Menu className="w-6 h-6 text-[var(--rc-blue)]" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[var(--rc-border)] absolute w-full">
          <nav className="container-rc py-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-base font-bold uppercase tracking-[0.2em] text-[var(--rc-text)] hover:text-[var(--rc-blue)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6 border-t border-[var(--rc-border)] flex flex-col gap-3">
              <Link
                to="/contact"
                className="px-6 py-4 bg-[var(--rc-orange)] text-white text-sm font-bold tracking-widest uppercase rounded-full text-center"
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
