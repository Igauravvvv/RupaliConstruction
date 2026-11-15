import { motion, useReducedMotion } from "framer-motion";
import { Check, MessageSquare, Award, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";

interface Leader {
  name: string;
  experience: string;
  description: string;
  specialties: string[];
  image: string;
  badges: { text: string; icon: any }[];
  imageShape: "circle";
  imageBg?: string;
  removeBg?: boolean;
  imageStyle?: React.CSSProperties;
}

const leaders: Leader[] = [
  {
    name: "S.P. Tyagi",
    experience: "25+ Years in Construction",
    description:
      "A visionary leader who laid the foundation of Rupali Construction. With over 25 years of hands-on experience, he has overseen the transformation of countless architectural dreams into concrete realities, ensuring every project meets the highest standards of quality and integrity.",
    specialties: ["Strategic Vision & Planning", "Quality Assurance & Control", "End-to-End Project Management"],
    image:
      "/images/Sptyagi.webp",
    badges: [
      { text: "Proven Leadership", icon: <Award className="w-4 h-4" /> },
      { text: "25+ Years Experience", icon: <Check className="w-4 h-4" /> },
    ],
    imageShape: "circle" as const,
  },
  {
    name: "N.K. Sharma",
    experience: "35+ Years in Construction",
    description:
      "Bringing over three and a half decades of invaluable industry expertise. His deep understanding of structural engineering, project management, and large-scale development has been the driving force behind the company's most ambitious and successful endeavors.",
    specialties: ["Structural Engineering Mastery", "Large-scale Development", "Operational Excellence"],
    image:
      "/images/Nksharma.webp",
    imageBg: "bg-white",
    badges: [
      { text: "Expert Engineering", icon: <Award className="w-4 h-4" /> },
      { text: "35+ Years Expertise", icon: <Check className="w-4 h-4" /> },
    ],
    imageShape: "circle" as const,
  },
  {
    name: "Ujjwal Tyagi",
    experience: "Driving Innovation",
    description:
      "Spearheading the modern growth of Rupali Construction. Combining fresh perspectives with core traditional values, he is focused on integrating innovative building technologies, sustainable practices, and expanding the company's footprint into new luxury segments.",
    specialties: ["Innovative Technologies", "Sustainable Practices", "Luxury & Modern Segments"],
    image:
      "/images/ujjwal_tyagi.webp",
    badges: [
      { text: "Innovation Driven", icon: <MessageSquare className="w-4 h-4" /> },
      { text: "Modern Growth", icon: <Check className="w-4 h-4" /> },
    ],
    imageShape: "circle" as const,
  },
];

export default function Leadership() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col font-sans relative">
      <SEO 
        title="Our Leadership & Founder Team | Rupali Construction"
        description="Meet the visionary leadership behind Rupali Construction: S.P. Tyagi, N.K. Sharma, and Ujjwal Tyagi, bringing over 35+ years of engineering and construction mastery in Gurugram."
        keywords="Rupali Construction founder, S.P. Tyagi construction Gurgaon, Ujjwal Tyagi Rupali Homes, Gurgaon construction developers team"
        url="/leadership"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "Leadership - Rupali Construction",
            "description": "Meet the experienced leadership team driving architectural excellence at Rupali Construction in Gurgaon.",
            "mainEntity": [
              {
                "@type": "Person",
                "name": "S.P. Tyagi",
                "jobTitle": "Founder & Leader",
                "worksFor": { "@type": "Organization", "name": "Rupali Construction" }
              },
              {
                "@type": "Person",
                "name": "N.K. Sharma",
                "jobTitle": "Structural Engineering Master",
                "worksFor": { "@type": "Organization", "name": "Rupali Construction" }
              },
              {
                "@type": "Person",
                "name": "Ujjwal Tyagi",
                "jobTitle": "Modern Growth & Innovation Lead",
                "worksFor": { "@type": "Organization", "name": "Rupali Construction" }
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rupaliconstruction.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Leadership",
                "item": "https://rupaliconstruction.com/leadership"
              }
            ]
          }
        ]}
      />
      <Navbar />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#edf3fc_0%,#f8fafc_38%,#ffffff_100%)]" />

      <main className="relative z-10 flex-1 pb-24 pt-28 sm:pt-36 lg:pt-40">
        <div className="container-rc relative z-10">
          <motion.header
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto mb-14 grid max-w-5xl gap-9 border-b border-[var(--rc-blue)]/15 pb-10 sm:mb-20 sm:pb-14 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12"
          >
            <div>
              <p className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--rc-orange)]"><span aria-hidden="true" className="h-px w-7 bg-[var(--rc-orange)]" />Our leadership</p>
              <h1 className="font-serif text-[2.6rem] leading-[1.06] tracking-tight text-[var(--rc-blue)] sm:text-6xl lg:text-[4.4rem]">The people<br /><span className="italic">behind the build.</span></h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-[#5b6c83] sm:text-base">Decades of hands-on experience. One shared commitment to thoughtful design, sound engineering and building well.</p>
              <a href="/contact" className="mt-6 inline-flex min-h-12 items-center gap-4 rounded-full bg-[var(--rc-blue)] px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#17477e]">Book a consultation<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
            <nav aria-label="Meet our leadership team" className="grid grid-cols-3 gap-3 sm:gap-5">
              {leaders.map((leader, index) => <a key={leader.name} href={`#leader-${index}`} className="group flex flex-col items-center text-center">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-[3rem_3rem_1rem_1rem] border border-[var(--rc-blue)]/10 bg-white shadow-[0_12px_30px_-22px_rgba(11,46,89,0.4)]"><img src={leader.image} alt={leader.name} className="h-full w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
                <span className="mt-3 text-[11px] font-semibold leading-snug text-[var(--rc-blue)] sm:text-xs">{leader.name}</span>
                <span className="mt-1 text-[9px] leading-snug text-[#6a7b91] sm:text-[10px]">{index === 0 ? "Vision & quality" : index === 1 ? "Engineering & delivery" : "Innovation & growth"}</span>
              </a>)}
            </nav>
          </motion.header>

          <div className="flex flex-col gap-24 lg:gap-32 max-w-5xl mx-auto">
            {leaders.map((leader, index) => {
              // Image on Right for 0 and 2. Image on Left for 1.
              const isImageRight = index % 2 === 0;

              return (
                  <div
                  key={leader.name}
                  id={`leader-${index}`}
                  style={{ scrollMarginTop: "110px" }}
                  className={`flex flex-row items-center gap-4 md:gap-12 lg:gap-20 ${
                    isImageRight ? "" : "flex-row-reverse"
                  }`}
                >
                  {/* Text Section */}
                  <div className="w-1/2 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: isImageRight ? -50 : 50, rotate: isImageRight ? -2 : 2 }}
                      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="relative z-10 bg-white/50 backdrop-blur-sm p-3 sm:p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
                    >
                      <motion.span 
                        whileHover={{ x: 5 }}
                        className="text-[var(--rc-blue)] font-bold tracking-widest uppercase text-[8px] sm:text-[10px] md:text-xs mb-1 md:mb-3 inline-block cursor-pointer"
                      >
                        {leader.experience}
                      </motion.span>
                      <motion.h2 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="text-lg sm:text-2xl md:text-4xl lg:text-6xl font-bold text-[var(--rc-dark)] tracking-tight mb-2 md:mb-4 leading-[1.1] drop-shadow-md"
                      >
                        {leader.name}
                      </motion.h2>
                      
                      <p className="text-[10px] sm:text-xs md:text-base lg:text-lg text-[var(--rc-text)]/70 leading-relaxed mb-4 md:mb-8">
                        {leader.description}
                      </p>

                      <div className="flex flex-col gap-2 md:gap-4 mb-4 md:mb-10">
                        {leader.specialties.map((specialty, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            whileHover={{ scale: 1.05, x: 5, backgroundColor: "var(--rc-orange)", color: "white" }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ type: "spring", stiffness: 200, delay: i * 0.1 + 0.3 }}
                            className="flex items-center gap-2 md:gap-4 p-1.5 md:p-3 rounded-lg md:rounded-xl transition-colors cursor-pointer group shadow-sm bg-white hover:shadow-md border border-gray-50"
                          >
                            <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[var(--rc-blue)]/10 group-hover:bg-white flex items-center justify-center shrink-0 shadow-inner">
                              <Check className="w-3 h-3 md:w-5 md:h-5 text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)]" strokeWidth={3} />
                            </div>
                            <span className="text-[var(--rc-dark)] group-hover:text-white font-bold text-[9px] sm:text-[10px] md:text-base lg:text-lg drop-shadow-sm line-clamp-1">{specialty}</span>
                          </motion.div>
                        ))}
                      </div>

                    </motion.div>
                  </div>

                  {/* Image Section */}
                  <div className={`w-1/2 relative flex justify-center items-center mt-4 md:mt-8 lg:-mt-10 ${index === 0 ? "lg:-mt-16" : ""}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: isImageRight ? 5 : -5 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.02 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="relative w-full max-w-[160px] sm:max-w-[220px] md:max-w-72 lg:max-w-none lg:w-[380px] aspect-[3/4] flex items-center justify-center z-10"
                    >
                      {/* Architectural Background Accents */}
                      <div className="absolute inset-0 z-0 rounded-3xl bg-[var(--rc-blue)] translate-x-4 translate-y-4 opacity-10" />
                      <div className="absolute -inset-4 z-0 rounded-3xl border border-[var(--rc-orange)]/30 -translate-x-2 -translate-y-2" />

                      {/* Main Image Container - Portrait */}
                      <div className={`relative z-10 w-full h-full rounded-xl md:rounded-3xl overflow-hidden border-4 md:border-[6px] border-white shadow-[0_10px_30px_rgba(10,37,64,0.15)] md:shadow-[0_20px_50px_rgba(10,37,64,0.15)] ${leader.removeBg ? 'bg-transparent border-none shadow-none' : (leader.imageBg || 'bg-[var(--rc-gray)]/50')}`}>
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          src={leader.image}
                          alt={leader.name}
                          className={`w-full h-full ${leader.removeBg ? 'mix-blend-multiply object-contain' : 'object-cover'}`}
                          style={{ objectPosition: 'center top', ...(leader.imageStyle || {}) }}
                        />
                      </div>

                      {/* Floating Badges */}
                      {leader.badges.map((badge, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.4 + (i * 0.2) }}
                          className={`absolute bg-white px-2 py-1 md:px-5 md:py-3 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.15)] md:shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex items-center gap-1 md:gap-3 border md:border-2 border-[var(--rc-orange)]/20 z-20 cursor-pointer ${
                            i === 0 
                              ? "-left-4 md:-left-16 lg:-left-28 -top-6 md:-top-8 lg:-top-12"
                              : "-right-4 md:-right-10 lg:-right-20 bottom-[10%] md:bottom-[15%]"
                          }`}
                        >
                          <motion.div 
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i }}
                            className="bg-gradient-to-br from-[var(--rc-orange)] to-orange-600 p-1 md:p-2 rounded-full text-white shadow-md md:shadow-lg"
                          >
                            <div className="w-3 h-3 md:w-auto md:h-auto flex items-center justify-center">
                              {badge.icon}
                            </div>
                          </motion.div>
                          <span className="font-bold text-[8px] sm:text-[10px] md:text-sm text-[var(--rc-dark)] tracking-tight md:tracking-wide">{badge.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
