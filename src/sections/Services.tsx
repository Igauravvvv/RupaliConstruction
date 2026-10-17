import { useState } from "react";
import { Home, Building2, Hammer, Paintbrush, Compass, HardHat, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import BuildingLineArt from "@/components/BuildingLineArt";
import ConsultationModal from "@/components/ConsultationModal";

const services = [
  {
    icon: Home,
    title: "Residential Construction",
    slug: "residential-construction",
    desc: "Premium luxury villas and turnkey builder floors built with precision civil engineering and finest materials.",
    highlights: ["550+ Built", "10-Yr Warranty", "0% Cost Overrun"],
    link: "/services/residential-construction",
  },
  {
    icon: Building2,
    title: "Commercial Construction",
    slug: "commercial-construction",
    desc: "Grade-A office towers, retail complexes, and commercial facilities designed for maximum efficiency.",
    highlights: ["Gold Gym", "Knowledge Center", "NBC 2016"],
    link: "/services/commercial-construction",
  },
  {
    icon: Hammer,
    title: "Renovation",
    slug: "renovation",
    desc: "Transform existing structures with structural upgrades, modern façades, and luxury MEP overhauls.",
    highlights: ["NDT Tested", "5-Yr Seepage Cover", "Dust-Free"],
    link: "/services/renovation",
  },
  {
    icon: Paintbrush,
    title: "Interior Design",
    slug: "interior-design",
    desc: "End-to-end luxury interiors with 100% German CNC factory-finished woodwork and 3D render fidelity.",
    highlights: ["100% Render Match", "German Hardware", "5-Yr Warranty"],
    link: "/services/interior-design",
  },
  {
    icon: Compass,
    title: "Architectural Design",
    slug: "architectural-design",
    desc: "Innovative architectural solutions blending aesthetics, natural ventilation, and strict Vastu compliance.",
    highlights: ["100% Vastu", "70+ Drawings", "3D Massing"],
    link: "/services/architectural-design",
  },
  {
    icon: HardHat,
    title: "Structural Engineering",
    slug: "structural-engineering",
    desc: "Seismic Zone IV engineering, non-destructive health audits, and stability certifications.",
    highlights: ["IS 1893 Zone IV", "FEA Modeling", "Stability Certs"],
    link: "/services/structural-engineering",
  },
];

export default function Services({ transparentBg = false }: { transparentBg?: boolean }) {
  const [consultService, setConsultService] = useState<string | null>(null);

  return (
    <section id="services" className={`py-16 md:py-24 lg:py-32 relative overflow-hidden ${transparentBg ? 'bg-transparent' : 'bg-[var(--rc-gray)]'}`}>
      <BuildingLineArt className="opacity-40 scale-75 md:scale-90 absolute right-0 -top-12 md:-top-24 origin-right md:translate-x-12 lg:translate-x-24" colorClass="text-[var(--rc-orange)]" />
      
      <div className="container-rc relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="text-center mb-16"
        >
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            className="text-3xl md:text-4xl font-serif italic tracking-wide text-[var(--rc-orange)] mb-4"
          >
            Our Services
          </motion.p>
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            className="text-display-2 text-[var(--rc-dark)] max-w-4xl mx-auto"
          >
            Built for Precision
          </motion.h2>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            className="text-[var(--rc-muted)] mt-4 max-w-2xl mx-auto text-sm sm:text-base"
          >
            Explore our specialized categories to see our step-by-step execution methodology, technical quality checks, and guaranteed USPs.
          </motion.p>
        </motion.div>

        {/* Responsive Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="service-card group relative p-5 sm:p-7 md:p-8 rounded-3xl bg-white border border-[var(--rc-border)] hover:border-[var(--rc-orange)]/40 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--rc-orange)]/5 flex flex-col justify-between h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--rc-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[var(--rc-blue)] flex items-center justify-center group-hover:scale-105 group-hover:bg-[var(--rc-orange)] transition-all duration-500 shadow-md shrink-0">
                      <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setConsultService(service.title)}
                      className="px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[var(--rc-orange)] text-xs font-bold border border-orange-200 transition-all active:scale-95 flex items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Book Consult
                    </button>
                  </div>
                  
                  <Link to={service.link} className="block group-hover:text-[var(--rc-orange)] transition-colors">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[var(--rc-dark)] mb-2 group-hover:text-[var(--rc-orange)] transition-colors">
                      {service.title}
                    </h3>
                  </Link>

                  <p className="text-[var(--rc-muted)] text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                    {service.desc}
                  </p>

                  {/* Highlights Pills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                    {service.highlights.map((h, hIdx) => (
                      <span 
                        key={hIdx} 
                        className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Links */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <Link 
                    to={service.link}
                    className="inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)] transition-colors"
                  >
                    Explore Steps & Checks
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setConsultService(service.title)}
                    className="text-xs font-semibold text-gray-500 hover:text-[var(--rc-orange)] transition-colors"
                  >
                    Request a Call
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={!!consultService}
        onClose={() => setConsultService(null)}
        serviceName={consultService || "Residential Construction"}
        defaultMessage={consultService ? `I would like to book a consultation for ${consultService}.` : ""}
      />
    </section>
  );
}
