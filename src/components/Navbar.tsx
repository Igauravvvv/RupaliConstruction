import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Shield } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,71,198,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-rc flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="flex items-center py-2 hover:opacity-90 transition-opacity">
          <img
            src="/logo-main.png"
            alt="Rupali Construction"
            className="h-20 md:h-24 lg:h-32 w-auto object-contain mix-blend-multiply scale-[1.5] md:scale-[1.8] origin-left translate-y-2 lg:translate-y-4"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-[var(--rc-orange)] ${
                location.pathname === link.href
                  ? "text-[var(--rc-blue)]"
                  : "text-[var(--rc-text)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-[var(--rc-orange)] text-white text-sm font-medium rounded-full hover:scale-105 transition-transform"
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
        <div className="md:hidden bg-white border-t border-[var(--rc-border)]">
          <nav className="container-rc py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium uppercase tracking-wide text-[var(--rc-text)] hover:text-[var(--rc-orange)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[var(--rc-border)] flex flex-col gap-3">
              <Link
                to="/contact"
                className="px-5 py-2.5 bg-[var(--rc-orange)] text-white text-sm font-medium rounded-full text-center"
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
