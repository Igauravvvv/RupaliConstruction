import { getResponsiveImage } from '@/lib/responsive-images';
import { useState } from "react";
import { Home, Building2, Hammer, Paintbrush, Compass, HardHat, Sparkles, ArrowRight } from "lucide-react";
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
    highlights: ["QuickIn Stayz", "Gold Gym", "Knowledge Center"],
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

export default function Services({ transparentBg = false, homePreview = false }: { transparentBg?: boolean; homePreview?: boolean }) {
  const [consultService, setConsultService] = useState<string | null>(null);

  if (homePreview) {
    const photos = [
      { src: "/images/services/residential.webp", alt: "Illustrative photo of workers constructing residential brickwork" },
      { src: "/images/services/commercial.webp", alt: "Illustrative photo of cranes and a commercial building under construction" },
      { src: "/images/services/renovation.webp", alt: "Illustrative photo of a tradesperson renovating an interior" },
      { src: "/images/services/interiors.webp", alt: "Illustrative photo of finishes, fabrics and samples for interior design" },
    ];
    const descriptions = ["A home designed around the way you live.", "Spaces that work as hard as your business.", "A fresh chapter for the space you already love.", "Materials, light and details, brought together."];
    return <section id="services" className="relative overflow-hidden bg-[var(--rc-blue)] py-14 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-60 h-[600px] w-[600px] rounded-full bg-[#5089d5]/20 blur-[100px]" />
      <div className="container-rc relative">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-12 md:flex-row md:items-end">
          <div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ffad78]">Our expertise</p><h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">Every space.<br /><span className="italic text-[#b9d1f2]">Every possibility.</span></h2></div>
          <p className="max-w-xs text-sm leading-relaxed text-[#d0def0]">From a new beginning to a thoughtful transformation. Find the right team for your next chapter.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
          {services.slice(0, 4).map((service, i) => <motion.article key={service.slug} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}} transition={{duration:0.5,delay:i%2*0.08}} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#143b6a] sm:rounded-3xl">
            <Link to={service.link} className="relative block h-36 shrink-0 overflow-hidden sm:h-56 lg:h-64" aria-label={`Explore ${service.title}`}><img src={getResponsiveImage(photos[i].src)?.src || photos[i].src} srcSet={getResponsiveImage(photos[i].src)?.srcSet} sizes="(min-width: 1024px) 50vw, 50vw" decoding="async" alt={photos[i].alt} width="900" height="600" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#071e3d]/55 to-transparent" /><span className="absolute left-4 top-4 text-[10px] font-mono text-white/85 sm:left-6 sm:top-5">0{i+1}</span><div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur-sm sm:h-11 sm:w-11"><service.icon className="h-4 w-4 sm:h-5 sm:w-5" /></div></Link>
            <div className="flex flex-1 flex-col bg-[#edf3fc] p-3.5 sm:p-5 lg:p-6"><h3 className="font-serif text-lg leading-tight text-[var(--rc-blue)] sm:text-2xl lg:text-3xl"><Link to={service.link}>{service.title}</Link></h3><p className="mt-1.5 text-xs leading-relaxed text-[#55657e] sm:text-sm">{descriptions[i]}</p><div className="mt-3 flex items-center justify-between border-t border-[var(--rc-blue)]/15 pt-2 sm:pt-2.5"><Link to={service.link} className="inline-flex min-h-7 items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--rc-blue)] sm:text-xs">Explore<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link><button type="button" onClick={()=>setConsultService(service.title)} className="hidden text-xs text-[#55657e] hover:text-[var(--rc-orange)] sm:block">Book a consultation</button></div></div>
          </motion.article>)}
        </div>
        <div className="mt-8 text-center sm:mt-10"><Link to="/services" className="inline-flex min-h-12 items-center gap-4 rounded-full border border-white/35 px-7 py-3 text-xs font-semibold text-white transition-colors hover:bg-white/10">Explore More Services<ArrowRight className="h-4 w-4" /></Link></div>
      </div>
      <ConsultationModal isOpen={!!consultService} onClose={()=>setConsultService(null)} serviceName={consultService || "Residential Construction"} defaultMessage={consultService ? `I would like to book a consultation for ${consultService}.` : ""} />
    </section>;
  }

  return (
    <section id="services" className={`py-12 md:py-24 lg:py-32 relative overflow-hidden ${transparentBg ? 'bg-transparent' : 'bg-[var(--rc-gray)]'}`}>
      <BuildingLineArt className="opacity-40 scale-75 md:scale-90 absolute right-0 -top-12 md:-top-24 origin-right md:translate-x-12 lg:translate-x-24" colorClass="text-[var(--rc-orange)]" />
      
      <div className="container-rc relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="text-center mb-8 sm:mb-16"
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
            From residential and commercial construction to renovation, interiors, architecture and structural engineering—explore the support your project needs.
          </motion.p>
        </motion.div>

        {/* Responsive Horizontal Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
          {(homePreview ? services.slice(0, 4) : services).map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="service-card group relative p-3.5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[var(--rc-border)] hover:border-[var(--rc-orange)]/40 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--rc-orange)]/5 flex flex-col justify-between h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--rc-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div>
                  <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--rc-blue)] flex items-center justify-center group-hover:scale-105 group-hover:bg-[var(--rc-orange)] transition-all duration-500 shadow-md shrink-0">
                      <service.icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setConsultService(service.title)}
                      className="hidden sm:flex px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[var(--rc-orange)] text-xs font-bold border border-orange-200 transition-all active:scale-95 items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Book Consult
                    </button>
                  </div>
                  
                  <Link to={service.link} className="block group-hover:text-[var(--rc-orange)] transition-colors">
                    <h3 className="text-[15px] sm:text-xl md:text-2xl leading-snug min-h-[2.75rem] sm:min-h-0 font-serif font-bold text-[var(--rc-dark)] mb-2 group-hover:text-[var(--rc-orange)] transition-colors">
                      {service.title}
                    </h3>
                  </Link>

                  <p className="text-[var(--rc-muted)] text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-none mb-3 sm:mb-4">
                    {service.desc}
                  </p>

                  {/* Highlights Pills */}
                  <div className="hidden sm:flex flex-wrap gap-2 mb-6">
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
                <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <Link 
                    to={service.link}
                    className="inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)] transition-colors"
                  >
                    <span className="sm:hidden">Explore</span><span className="hidden sm:inline">Explore Steps &amp; Checks</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setConsultService(service.title)}
                    className="hidden sm:block text-xs font-semibold text-gray-500 hover:text-[var(--rc-orange)] transition-colors"
                  >
                    Request a Call
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {homePreview && <div className="mt-7 text-center sm:mt-10"><Link to="/services" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[var(--rc-blue)]/20 bg-white px-6 py-3 text-sm font-semibold text-[var(--rc-blue)] transition-colors hover:bg-[var(--rc-blue)] hover:text-white">Explore More<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>}
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
