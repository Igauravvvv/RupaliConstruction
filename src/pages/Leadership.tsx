import { motion, useScroll, useTransform } from "framer-motion";
import { Check, MessageSquare, Award, ArrowRight, HardHat, Hammer, Ruler, Wrench, Cone, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";

const FloatingIcon = ({ icon: Icon, delay, x, y, duration, size = 120 }: any) => (
  <motion.div
    initial={{ y: 0, opacity: 0.6 }}
    animate={{ 
      y: [0, -40, 0], 
      rotate: [0, 15, -15, 0],
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.9, 0.6]
    }}
    transition={{ duration: duration, repeat: Infinity, delay: delay, ease: "easeInOut" }}
    className="absolute text-[var(--rc-orange)] z-0 pointer-events-none drop-shadow-[0_0_20px_rgba(242,101,34,0.5)]"
    style={{ left: x, top: y }}
  >
    <Icon size={size} strokeWidth={2} />
  </motion.div>
);

const leaders = [
  {
    name: "S.P. Tyagi",
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
    name: "N.K. Sharma",
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
  const { scrollYProgress } = useScroll();
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col font-sans relative">
      <Navbar />

      {/* Background Image with Premium Gradient Fade */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=80" 
          alt="Construction Leadership and Planning"
          className="w-full h-full object-cover object-[center_20%] opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[var(--rc-white)]/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--rc-white)]/60 to-[var(--rc-white)]" />
      </div>

      {/* Funny Construction Background Elements */}
      <motion.div style={{ y: yOffset }} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingIcon icon={HardHat} x="5%" y="15%" delay={0} duration={6} size={150} />
        <FloatingIcon icon={Hammer} x="85%" y="25%" delay={1} duration={7} size={120} />
        <FloatingIcon icon={Cone} x="8%" y="45%" delay={2} duration={5} size={140} />
        <FloatingIcon icon={Ruler} x="85%" y="60%" delay={0.5} duration={6.5} size={160} />
        <FloatingIcon icon={Truck} x="10%" y="80%" delay={1.5} duration={8} size={180} />
        <FloatingIcon icon={Wrench} x="80%" y="85%" delay={0.8} duration={5.5} size={130} />
      </motion.div>

      <main className="flex-1 relative z-10 pt-32 pb-32">
        <div className="container-rc relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="text-center mb-24 max-w-4xl mx-auto relative z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_70%)] blur-2xl -z-10 scale-150" />
            <motion.h1 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="text-6xl lg:text-[7rem] leading-none font-serif italic text-[var(--rc-orange)] drop-shadow-xl mb-6 inline-block cursor-default"
            >
              Our Leadership
            </motion.h1>
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
                      initial={{ opacity: 0, x: isImageRight ? -100 : 100, rotate: isImageRight ? -5 : 5 }}
                      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="relative z-10 bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
                    >
                      <motion.span 
                        whileHover={{ x: 10 }}
                        className="text-[var(--rc-blue)] font-bold tracking-widest uppercase text-xs mb-3 inline-block cursor-pointer"
                      >
                        {leader.experience}
                      </motion.span>
                      <motion.h2 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="text-4xl lg:text-6xl font-bold text-[var(--rc-dark)] tracking-tight mb-4 leading-[1.1] drop-shadow-md"
                      >
                        {leader.name}
                      </motion.h2>
                      
                      <p className="text-base lg:text-lg text-[var(--rc-text)]/70 leading-relaxed mb-8">
                        {leader.description}
                      </p>

                      <div className="flex flex-col gap-4 mb-10">
                        {leader.specialties.map((specialty, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -50, scale: 0.8 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            whileHover={{ scale: 1.05, x: 10, backgroundColor: "var(--rc-orange)", color: "white" }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ type: "spring", stiffness: 200, delay: i * 0.1 + 0.3 }}
                            className="flex items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer group shadow-sm bg-white hover:shadow-md border border-gray-50"
                          >
                            <div className="w-8 h-8 rounded-full bg-[var(--rc-blue)]/10 group-hover:bg-white flex items-center justify-center shrink-0 shadow-inner">
                              <Check className="w-5 h-5 text-[var(--rc-blue)] group-hover:text-[var(--rc-orange)]" strokeWidth={3} />
                            </div>
                            <span className="text-[var(--rc-dark)] group-hover:text-white font-bold text-base lg:text-lg drop-shadow-sm">{specialty}</span>
                          </motion.div>
                        ))}
                      </div>

                      <motion.a
                        href="/contact"
                        whileHover={{ scale: 1.1, rotate: -3 }}
                        whileTap={{ scale: 0.9 }}
                        className="inline-flex items-center gap-3 bg-[var(--rc-blue)] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_10px_30px_rgba(10,37,64,0.4)] hover:bg-[var(--rc-orange)] hover:shadow-[0_10px_30px_rgba(242,101,34,0.4)] transition-all self-start"
                      >
                        Book a Consultation
                        <ArrowRight className="w-4 h-4" />
                      </motion.a>
                    </motion.div>
                  </div>

                  {/* Image Section */}
                  <div className={`w-full lg:w-1/2 relative flex justify-center items-center mt-8 lg:-mt-10 ${index === 0 ? "lg:-mt-16" : ""}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: isImageRight ? 15 : -15 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.05 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="relative w-72 lg:w-[420px] aspect-square flex items-center justify-center z-10"
                    >
                      {/* Solid Rotating Background Shape in Brand Colors */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 z-0 shadow-[0_20px_50px_rgba(10,37,64,0.3)] rounded-full bg-gradient-to-br from-[var(--rc-blue)] to-[var(--rc-dark)]" 
                      />
                      <div className="absolute -inset-6 z-0 rounded-full border-4 border-dashed border-[var(--rc-orange)]/60 animate-[spin_15s_linear_infinite]" />

                      {/* Main Image Container - Perfectly circular */}
                      <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-8 border-white shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] bg-[var(--rc-gray)]">
                        <motion.img
                          whileHover={{ scale: 1.15, rotate: 3 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center top' }}
                        />
                      </div>

                      {/* Floating Badges */}
                      {leader.badges.map((badge, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 50, scale: 0.5 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          whileHover={{ scale: 1.15, y: -10 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.4 + (i * 0.2) }}
                          className={`absolute bg-white px-5 py-3 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex items-center gap-3 border-2 border-[var(--rc-orange)]/20 z-20 cursor-pointer ${
                            i === 0 
                              ? "-left-16 top-1/4"
                              : "-right-12 bottom-1/4"
                          }`}
                        >
                          <motion.div 
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i }}
                            className="bg-gradient-to-br from-[var(--rc-orange)] to-orange-600 p-2 rounded-full text-white shadow-lg"
                          >
                            {badge.icon}
                          </motion.div>
                          <span className="font-bold text-sm text-[var(--rc-dark)] tracking-wide">{badge.text}</span>
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
