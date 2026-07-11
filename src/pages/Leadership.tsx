import { motion } from "framer-motion";
import { Check, MessageSquare, Award, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";

const leaders = [
  {
    name: "S.P. Tyagi",
    role: "Owner",
    experience: "25+ Years in Construction",
    description:
      "A visionary leader who laid the foundation of Rupali Construction. With over 25 years of hands-on experience, he has overseen the transformation of countless architectural dreams into concrete realities, ensuring every project meets the highest standards of quality and integrity.",
    specialties: ["Strategic Vision & Planning", "Quality Assurance & Control", "End-to-End Project Management"],
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800&h=1000",
    badges: [
      { text: "Proven Leadership", icon: <Award className="w-4 h-4" /> },
      { text: "25+ Years Experience", icon: <Check className="w-4 h-4" /> },
    ],
    imageShape: "circle" as const,
  },
  {
    name: "R.S. Sharma",
    role: "Partner",
    experience: "35+ Years in Construction",
    description:
      "Bringing over three and a half decades of invaluable industry expertise. His deep understanding of structural engineering, project management, and large-scale development has been the driving force behind the company's most ambitious and successful endeavors.",
    specialties: ["Structural Engineering Mastery", "Large-scale Development", "Operational Excellence"],
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800&h=1000",
    badges: [
      { text: "Expert Engineering", icon: <Award className="w-4 h-4" /> },
    ],
    imageShape: "circle" as const,
  },
  {
    name: "Ujjwal Tyagi",
    role: "Director",
    experience: "Driving Innovation",
    description:
      "Spearheading the modern growth of Rupali Construction. Combining fresh perspectives with core traditional values, he is focused on integrating innovative building technologies, sustainable practices, and expanding the company's footprint into new luxury segments.",
    specialties: ["Innovative Technologies", "Sustainable Practices", "Luxury & Modern Segments"],
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=800&h=1000",
    badges: [
      { text: "Innovation Driven", icon: <MessageSquare className="w-4 h-4" /> },
      { text: "Modern Growth", icon: <Check className="w-4 h-4" /> },
    ],
    imageShape: "circle" as const,
  },
];

export default function Leadership() {
  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 relative z-10 pt-32 pb-32">
        <div className="container-rc relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-24 text-center"
          >
            <h1 className="text-6xl lg:text-[7rem] leading-none font-serif italic text-[var(--rc-orange)] drop-shadow-sm mb-6">
              Our Leadership
            </h1>
            <p className="text-xl md:text-2xl text-[var(--rc-text)]/80 max-w-3xl mx-auto font-light">
              The visionary minds driving engineering precision and architectural excellence.
            </p>
          </motion.div>

          <div className="flex flex-col gap-24 lg:gap-32 max-w-5xl mx-auto">
            {leaders.map((leader, index) => {
              // Image on Right for 0 and 2. Image on Left for 1.
              const isImageRight = index % 2 === 0;

              return (
                  <div
                  key={leader.name}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                    isImageRight ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Text Section */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: isImageRight ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <span className="text-[var(--rc-blue)] font-bold tracking-widest uppercase text-xs mb-3 block">
                        {leader.experience}
                      </span>
                      <h2 className="text-4xl lg:text-5xl font-bold text-[var(--rc-dark)] tracking-tight mb-4 leading-[1.1]">
                        {leader.name}{" "}
                        <span className="text-[var(--rc-orange)] block font-serif italic font-normal mt-2">
                          {leader.role}
                        </span>
                      </h2>
                      
                      <p className="text-base lg:text-lg text-[var(--rc-text)]/70 leading-relaxed mb-8">
                        {leader.description}
                      </p>

                      <div className="flex flex-col gap-4 mb-10">
                        {leader.specialties.map((specialty, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                            className="flex items-center gap-4"
                          >
                            <div className="w-6 h-6 rounded-full bg-[var(--rc-blue)]/10 flex items-center justify-center shrink-0">
                              <Check className="w-4 h-4 text-[var(--rc-blue)]" strokeWidth={3} />
                            </div>
                            <span className="text-[var(--rc-dark)] font-bold text-base lg:text-lg">{specialty}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.a
                        href="/contact"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 bg-[var(--rc-blue)] text-white px-7 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-[var(--rc-blue)]/20 hover:bg-[var(--rc-dark)] transition-colors self-start"
                      >
                        Book a Consultation
                        <ArrowRight className="w-4 h-4" />
                      </motion.a>
                    </motion.div>
                  </div>

                  {/* Image Section */}
                  <div className="w-full lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0 pt-8">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="relative w-72 lg:w-[380px] aspect-square flex items-center justify-center"
                    >
                      {/* Solid Rotating Background Shape in Brand Colors */}
                      <div className="absolute inset-0 z-0 shadow-2xl rounded-full bg-[var(--rc-blue)]" />
                      <div className="absolute -inset-4 z-0 rounded-full border-2 border-dashed border-[var(--rc-orange)]/60 animate-[spin_20s_linear_infinite]" />

                      {/* Main Image Container - Perfectly circular */}
                      <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white shadow-inner bg-[var(--rc-gray)]">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          style={{ objectPosition: 'center top' }}
                        />
                      </div>

                      {/* Floating Badges */}
                      {leader.badges.map((badge, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.6 + (i * 0.2) }}
                          className={`absolute bg-white px-4 py-2 rounded-full shadow-xl shadow-black/10 flex items-center gap-2 border border-gray-100 z-20 ${
                            i === 0 
                              ? "-left-12 top-1/4"
                              : "-right-8 bottom-1/4"
                          }`}
                        >
                          <div className="bg-[var(--rc-orange)] p-1.5 rounded-full text-white">
                            {badge.icon}
                          </div>
                          <span className="font-bold text-xs text-[var(--rc-dark)]">{badge.text}</span>
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
