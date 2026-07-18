import { Link } from "react-router";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--rc-dark)] text-white relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <img
          src="/logo-icon.png"
          alt=""
          className="w-96 h-96 lg:w-[600px] lg:h-[600px] object-contain"
        />
      </div>

      <div className="container-rc relative z-10 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="py-4">
            <Link to="/" className="inline-flex items-center justify-center mb-6 hover:opacity-90 transition-opacity bg-white px-6 pt-6 pb-2 rounded-2xl shadow-lg">
              <img
                src="/logo-main.png?v=2"
                alt="Rupali Construction"
                className="w-72 md:w-80 object-contain block translate-y-1"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 mt-2">
              Premium residential and commercial construction solutions
              engineered for quality, transparency, and timely delivery across
              Gurgaon and Delhi NCR.
            </p>
            <div className="flex gap-4">
              {["LinkedIn", "Instagram", "Facebook"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-white/40 hover:text-[var(--rc-orange)] transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-label text-white/40 mb-6">Services</h4>
            <ul className="space-y-3">
              {[
                "Residential Construction",
                "Commercial Construction",
                "Renovation",
                "Interior Design",
                "Architectural Design",
                "Structural Engineering",
              ].map((service) => (
                <li key={service}>
                  <a href="/#services" className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer block">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-white/40 mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Get Estimate", href: "/#estimate" },
              ].map((link) => (
                <li key={link.label}>
                  {link.href.includes('#') ? (
                    <a
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors block"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors block"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-white/40 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--rc-orange)] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">
                  5th floor, M3M broadway,
                  <br />
                  Sector 71
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--rc-orange)] flex-shrink-0" />
                <a
                  href="tel:+919311830088"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  +91 9311830088
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--rc-orange)] flex-shrink-0" />
                <a
                  href="mailto:ujjwalt.rg@rupalihomes.com"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  ujjwalt.rg@rupalihomes.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Rupali Construction. All rights
            reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-[var(--rc-orange)] transition-colors"
          >
            Back to Top
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
