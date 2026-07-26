import { Home, Building2, Hammer, Paintbrush, Compass, HardHat } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import BuildingLineArt from "@/components/BuildingLineArt";

const services = [
  {
    icon: Home,
    title: "Residential Construction",
    desc: "Premium villas, apartments, and independent homes built with precision engineering and finest materials.",
    link: "/projects?type=residential",
  },
  {
    icon: Building2,
    title: "Commercial Construction",
    desc: "Office buildings, retail spaces, and industrial facilities designed for modern business needs.",
    link: "/projects?type=commercial",
  },
  {
    icon: Hammer,
    title: "Renovation",
    desc: "Transform existing structures with structural upgrades, façade improvements, and modern amenities.",
    link: "/projects?type=renovation",
  },
  {
    icon: Paintbrush,
    title: "Interior Design",
    desc: "End-to-end interior solutions from concept to execution, creating spaces that inspire.",
    link: "/projects?type=interior",
  },
  {
    icon: Compass,
    title: "Architectural Design",
    desc: "Innovative architectural solutions blending aesthetics with structural excellence and Vastu compliance.",
    link: "/contact",
  },
  {
    icon: HardHat,
    title: "Structural Engineering",
    desc: "Advanced structural analysis and engineering for complex, large-scale construction projects.",
    link: "/contact",
  },
];

export default function Services({ transparentBg = false }: { transparentBg?: boolean }) {
  return (
    <section id="services" className={`py-16 md:py-24 lg:py-32 relative overflow-hidden ${transparentBg ? 'bg-transparent' : 'bg-[var(--rc-gray)]'}`}>
      <BuildingLineArt className="opacity-40 scale-75 md:scale-90 absolute right-0 -top-12 md:-top-24 origin-right md:translate-x-12 lg:translate-x-24" colorClass="text-[var(--rc-orange)]" />
      
      <div className="container-rc relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="text-center mb-16"
        >
          <motion.p 
            variants={{ hidden: { opacity: 0, x: "100vw" }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.1 } } }}
            className="text-3xl md:text-4xl font-serif italic tracking-wide text-[var(--rc-orange)] mb-4"
          >
            Our Services
          </motion.p>
          <motion.h2 
            variants={{ hidden: { opacity: 0, x: "100vw" }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.1 } } }}
            className="text-display-2 text-[var(--rc-dark)] max-w-4xl mx-auto whitespace-nowrap"
          >
            Built for Precision
          </motion.h2>
          <motion.p 
            variants={{ hidden: { opacity: 0, x: "100vw" }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.1 } } }}
            className="text-[var(--rc-muted)] mt-4 max-w-xl mx-auto"
          >
            From concept to completion, we offer a comprehensive suite of construction services tailored to your vision.
          </motion.p>
        </motion.div>

        {/* Responsive Horizontal Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6 md:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={service.link}
                className="service-card group relative p-4 sm:p-6 md:p-8 rounded-2xl bg-white border border-[var(--rc-border)] hover:border-[var(--rc-orange)]/40 transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--rc-orange)]/10 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8 h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--rc-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 shrink-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-[var(--rc-blue)] flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--rc-orange)] transition-all duration-500 shadow-md">
                    <service.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col h-full flex-grow">
                  <h3 className="text-base sm:text-xl md:text-2xl font-semibold text-[var(--rc-dark)] mb-2 sm:mb-3 group-hover:text-[var(--rc-orange)] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-[var(--rc-muted)] text-xs sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 flex-grow">
                    {service.desc}
                  </p>
                  
                  <span className="inline-flex items-center text-[10px] sm:text-sm font-bold uppercase tracking-wider text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)] transition-colors cursor-pointer mt-auto">
                    Explore
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
