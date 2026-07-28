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
    { label: "Services", href: "/services" },
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
            src="/logo-main.webp?v=2"
            alt="Rupali Construction"
            className={`w-48 h-auto md:w-auto md:h-24 lg:h-32 object-contain md:scale-[1.8] origin-left translate-y-1 md:translate-y-2 lg:translate-y-4 transition-all duration-500 ${
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

        <div className={`hidden md:flex items-center ${isAuthenticated ? 'gap-3 md:-mr-12 lg:-mr-24 xl:-mr-32' : 'gap-4 md:-mr-8 lg:-mr-16'}`}>
          <Link
            to="/contact"
            className={`px-8 py-3 text-sm font-bold tracking-wider uppercase rounded-full transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl ${
              isDarkSection 
                ? "bg-white text-[var(--rc-blue)] hover:bg-[var(--rc-orange)] hover:text-white shadow-white/10 hover:shadow-[var(--rc-orange)]/30"
                : "bg-[var(--rc-blue)] text-white hover:bg-[var(--rc-dark)] shadow-[var(--rc-blue)]/30 hover:shadow-[var(--rc-blue)]/40"
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
                <span className="text-xs font-bold tracking-wider uppercase max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
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
            className="p-2 group relative z-50 w-12 h-12 flex flex-col items-end justify-center gap-[6px]"
            aria-label="Toggle Menu"
          >
            <span className={`block h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] origin-center ${
              mobileOpen ? 'w-6 rotate-45 translate-y-[7.5px]' : 'w-7 group-hover:w-5'
            } ${isDarkSection ? "text-white" : "text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)]"}`} />
            
            <span className={`block h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
              mobileOpen ? 'w-0 opacity-0 translate-x-4' : 'w-5 group-hover:w-7'
            } ${isDarkSection ? "text-white" : "text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)]"}`} />
            
            <span className={`block h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] origin-center ${
              mobileOpen ? 'w-6 -rotate-45 -translate-y-[7.5px]' : 'w-6 group-hover:w-4'
            } ${isDarkSection ? "text-white" : "text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)]"}`} />
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden fixed inset-0 top-[80px] h-[calc(100vh-80px)] overflow-y-auto backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] flex flex-col z-40 ${
          mobileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-8"
        } ${isDarkSection ? "bg-[var(--rc-blue)]/95" : "bg-white/95"}`}
      >
        <nav className="container-rc py-10 flex flex-col gap-6 flex-grow">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => {
                setMobileOpen(false);
                window.scrollTo(0, 0);
              }}
              className={`group flex items-center justify-between text-3xl sm:text-4xl font-light tracking-tight transition-all duration-300 ${
                isDarkSection ? "text-white/90 hover:text-[var(--rc-orange)]" : "text-[var(--rc-dark)]/80 hover:text-[var(--rc-blue)]"
              }`}
              style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms' }}
            >
              <span className={`transform transition-all duration-500 ${mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`} style={{ transitionDelay: mobileOpen ? `${i * 50 + 100}ms` : '0ms' }}>
                {link.label}
              </span>
              <span className={`h-[2px] w-12 transition-all duration-500 origin-right scale-x-0 group-hover:scale-x-100 ${
                isDarkSection ? "bg-[var(--rc-orange)]" : "bg-[var(--rc-blue)]"
              }`} />
            </Link>
          ))}

          <div className={`mt-auto pt-10 flex flex-col gap-4 w-full transition-all duration-700 delay-300 ${mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className={`w-full py-5 text-sm font-bold tracking-[0.2em] uppercase text-center transition-all duration-300 rounded-2xl shadow-xl hover:-translate-y-1 ${
                isDarkSection 
                  ? "bg-white text-[var(--rc-blue)] hover:bg-[var(--rc-orange)] hover:text-white shadow-black/10 hover:shadow-[var(--rc-orange)]/20"
                  : "bg-[var(--rc-orange)] text-white hover:bg-[var(--rc-blue)] shadow-[var(--rc-orange)]/20 hover:shadow-[var(--rc-blue)]/30"
              }`}
            >
              Get Estimate
            </Link>

            {isAuthenticated ? (
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to={user?.role === "admin" ? "/admin" : "/"}
                  onClick={() => setMobileOpen(false)}
                  className={`py-4 text-sm font-bold tracking-wider uppercase rounded-2xl text-center flex items-center justify-center gap-2 border transition-colors ${
                    isDarkSection ? "border-white/20 text-white hover:bg-white/10" : "border-[var(--rc-border)] text-[var(--rc-dark)] hover:bg-[var(--rc-gray)]"
                  }`}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="truncate max-w-[80px]">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className={`py-4 text-sm font-bold tracking-wider uppercase rounded-2xl text-center flex items-center justify-center gap-2 border transition-colors ${
                    isDarkSection ? "border-red-400/30 text-red-300 hover:bg-red-500/10" : "border-red-200 text-red-500 hover:bg-red-50"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className={`w-full py-4 text-sm font-bold tracking-[0.2em] uppercase rounded-2xl text-center flex items-center justify-center gap-2 border transition-all duration-300 hover:-translate-y-1 ${
                  isDarkSection 
                    ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50" 
                    : "border-[var(--rc-blue)]/30 text-[var(--rc-blue)] hover:bg-[var(--rc-blue)]/5 hover:border-[var(--rc-blue)]/50"
                }`}
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
