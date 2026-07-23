import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 80);
        
        const darkSections = document.querySelectorAll('.dark-nav-trigger, #cinematic-reveal-section');
        let isDark = false;
        
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
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
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
          className="flex items-center py-2 hover:opacity-80 transition-opacity -ml-2 md:-ml-8 lg:-ml-16"
        >
          <img
            src="/logo-main.png?v=2"
            alt="Rupali Construction"
            className={`h-14 md:h-24 lg:h-32 w-auto object-contain scale-[2.2] md:scale-[1.8] origin-left translate-y-1 md:translate-y-2 lg:translate-y-4 transition-all duration-500 ${
              isDarkSection ? "drop-shadow-lg" : "md:mix-blend-multiply"
            }`}
          />
        </Link>

        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
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

        <div className="hidden md:flex items-center gap-4 md:-mr-8 lg:-mr-16">
          <Link
            to="/contact"
            className={`px-8 py-3 text-sm font-bold tracking-wider uppercase rounded-full transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl ${
              isDarkSection 
                ? "bg-white text-[var(--rc-blue)] hover:bg-[var(--rc-orange)] hover:text-white shadow-white/10 hover:shadow-[var(--rc-orange)]/30"
                : "bg-[var(--rc-orange)] text-white hover:bg-[var(--rc-dark)] shadow-orange-500/30 hover:shadow-orange-500/40"
            }`}
          >
            Get Estimate
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={user?.role === "admin" ? "/admin" : "/"}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
                  isDarkSection
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-[var(--rc-border)] text-[var(--rc-dark)] hover:bg-gray-50"
                }`}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="text-xs font-bold tracking-wider uppercase">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className={`p-2.5 rounded-full border transition-all duration-300 ${
                  isDarkSection
                    ? "border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/40"
                    : "border-[var(--rc-border)] text-[var(--rc-muted)] hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`group flex items-center gap-2 px-6 py-3 text-sm font-bold tracking-wider uppercase rounded-full transition-all duration-300 border backdrop-blur-sm hover:scale-105 hover:shadow-lg ${
                isDarkSection
                  ? "border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-white/40 hover:shadow-white/10"
                  : "border-[var(--rc-blue)]/20 bg-[var(--rc-blue)]/5 text-[var(--rc-blue)] hover:bg-[var(--rc-blue)]/10 hover:border-[var(--rc-blue)]/40 hover:shadow-[var(--rc-blue)]/10"
              }`}
            >
              <User className="w-4 h-4 transition-transform group-hover:scale-110" />
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          {/* Login / Profile Icon */}
          {isAuthenticated ? (
            <Link
              to={user?.role === "admin" ? "/admin" : "/"}
              className={`p-2 rounded-full transition-colors ${
                isDarkSection ? "text-white hover:bg-white/10" : "text-[var(--rc-blue)] hover:bg-[var(--rc-blue)]/10"
              }`}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className={`p-2 rounded-full transition-colors ${
                isDarkSection ? "text-white hover:bg-white/10" : "text-[var(--rc-blue)] hover:bg-[var(--rc-blue)]/10"
              }`}
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2"
          >
            {mobileOpen ? (
              <X className={`w-6 h-6 ${isDarkSection ? "text-white" : "text-[var(--rc-blue)]"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isDarkSection ? "text-white" : "text-[var(--rc-blue)]"}`} />
            )}
          </button>
        </div>
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

              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === "admin" ? "/admin" : "/"}
                    className={`px-6 py-4 text-sm font-bold tracking-widest uppercase rounded-full text-center flex items-center justify-center gap-2 border ${
                      isDarkSection ? "border-white/20 text-white" : "border-[var(--rc-border)] text-[var(--rc-dark)]"
                    }`}
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-5 h-5 rounded-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    {user?.name}
                  </Link>
                  <button
                    onClick={logout}
                    className={`px-6 py-4 text-sm font-bold tracking-widest uppercase rounded-full text-center flex items-center justify-center gap-2 ${
                      isDarkSection ? "text-red-300" : "text-red-500"
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`px-6 py-4 text-sm font-bold tracking-widest uppercase rounded-full text-center flex items-center justify-center gap-2 border ${
                    isDarkSection ? "border-white/20 text-white" : "border-[var(--rc-border)] text-[var(--rc-dark)]"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
