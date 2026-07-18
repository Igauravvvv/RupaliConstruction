import { useState, useEffect, useRef } from "react";
import { ArrowUp, Phone, Mail, Instagram, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactOptions = [
    {
      name: "Call Us",
      icon: <Phone className="w-5 h-5" />,
      href: "tel:+919311830088",
      color: "bg-blue-500",
    },
    {
      name: "Email Us",
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:contact@rupaliconstruction.com",
      color: "bg-red-500",
    },
    {
      name: "@rupali_homes",
      icon: <Instagram className="w-5 h-5" />,
      href: "https://instagram.com/rupaliconstruction",
      color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      ),
      href: "https://wa.me/919311830088?text=Hey%20%2C%20i%20want%20to%20contruct%20a%20property%20%2C%20can%20we%20discuss%20its%20cost%20estimation",
      color: "bg-green-500",
    }
  ];

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" 
      ref={menuRef}
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      
      {/* Contact Menu Options */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col items-end gap-3 mb-2 absolute bottom-[100%] right-0"
          >
            {contactOptions.map((opt, i) => (
              <motion.a
                key={opt.name}
                href={opt.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className={`h-12 px-5 ${opt.color} text-white rounded-full flex items-center justify-center gap-3 shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {opt.icon}
                <span className="text-sm font-medium whitespace-nowrap tracking-wide">{opt.name}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Contact Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-14 h-14 bg-[var(--rc-orange)] text-white rounded-full flex items-center justify-center shadow-[0_4px_14px_0_rgba(255,90,31,0.39)] hover:brightness-110 hover:shadow-[0_6px_20px_rgba(255,90,31,0.3)] hover:scale-105 transition-all duration-300 focus:outline-none z-10"
        aria-label="Contact Options"
      >
        {isMenuOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-[var(--rc-dark)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--rc-orange)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--rc-orange)] focus:ring-offset-2 mt-2"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
