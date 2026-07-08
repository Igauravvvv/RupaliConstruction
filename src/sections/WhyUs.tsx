import { DollarSign, Layers, ShieldCheck, Radio, Users } from "lucide-react";
import { motion } from "framer-motion";
import SkyscraperLineArt from "@/components/SkyscraperLineArt";
import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: DollarSign,
    title: "Value-Driven Pricing",
    desc: "No hidden costs. Complete clarity on every rupee spent. Our transparent and reasonable pricing model ensures you get the best value for your investment.",
    image: "/images/whyus_pricing.png",
  },
  {
    icon: Layers,
    title: "Stage-wise Payments",
    desc: "Pay only as construction progresses. Milestone-based payment structure keeps you in control of your investment.",
    image: "/images/whyus_payments.png",
  },
  {
    icon: ShieldCheck,
    title: "Quality Checks",
    desc: "Multiple inspections at every milestone. Our rigorous quality assurance process ensures structural integrity at every phase.",
    image: "/images/whyus_quality.png",
  },
  {
    icon: Radio,
    title: "Live Tracking",
    desc: "Track your project in real-time. Get daily photo updates, material logs, and progress reports directly on your device.",
    image: "/images/whyus_tracking.png",
  },
  {
    icon: Users,
    title: "Expert Team",
    desc: "Led by industry veterans bringing together a powerful combined experience of 60 years in premium construction across NCR.",
    image: "/images/whyus_team.png",
  },
];

export default function WhyUs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 lg:py-32 bg-[var(--rc-white)] relative overflow-x-clip overflow-y-visible z-20">
      <SkyscraperLineArt className="opacity-40 scale-50 md:scale-75 absolute left-0 -translate-x-1/3 origin-bottom-left" colorClass="text-[var(--rc-blue)]" />
      <div className="absolute inset-0 pointer-events-none scale-x-[-1]">
        <SkyscraperLineArt className="opacity-40 scale-50 md:scale-75 absolute left-0 -translate-x-1/3 origin-bottom-left" colorClass="text-[var(--rc-blue)]" />
      </div>
      
      <div className="container-rc relative z-10 mb-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="text-center"
        >
          <motion.p 
            variants={{ hidden: { opacity: 0, x: "-100vw" }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.1 } } }}
            className="text-6xl lg:text-[7rem] leading-none font-serif italic text-[var(--rc-orange)] mb-2 drop-shadow-sm"
          >
            Why Choose Us
          </motion.p>
          <motion.h2 
            variants={{ hidden: { opacity: 0, x: "-100vw" }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.1 } } }}
            className="text-xl md:text-2xl font-medium text-[var(--rc-dark)] max-w-4xl mx-auto"
          >
            The Rupali Advantage
          </motion.h2>
        </motion.div>
      </div>

      <div className="w-full relative z-10 px-2 md:px-4 lg:px-8">
        <div className="flex h-[450px] lg:h-[550px] w-full gap-2 md:gap-4">
          {features.map((feature, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setActiveIndex(i)}
                style={{ flex: isActive ? 4 : 1 }}
                className="relative rounded-2xl lg:rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group bg-[var(--rc-gray)]"
              >
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-transform duration-700",
                    isActive ? "scale-105" : "scale-100 group-hover:scale-105"
                  )} 
                />
                
                {/* Gradient overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90 transition-opacity duration-700" />
                <div className={cn(
                  "absolute inset-0 bg-black/50 transition-opacity duration-700",
                  isActive ? "opacity-0" : "opacity-100"
                )} />

                <div className="absolute bottom-6 left-2 lg:left-6 right-2 lg:right-6 flex flex-col justify-end">
                  
                  {/* Horizontal title for inactive state */}
                  <div 
                    className={cn(
                      "absolute bottom-[60px] lg:bottom-[80px] left-0 right-0 flex items-center justify-center pointer-events-none transition-opacity duration-500",
                      isActive ? "opacity-0" : "opacity-100 delay-300"
                    )}
                  >
                    <h3 className="text-[10px] sm:text-xs lg:text-sm font-serif text-white/90 tracking-wider lg:tracking-[0.1em] uppercase shadow-black drop-shadow-md whitespace-normal text-center leading-snug px-1">
                      {feature.title}
                    </h3>
                  </div>

                  <div className={cn(
                    "flex items-center relative z-10 transition-all duration-700",
                    isActive ? "gap-4 justify-start" : "gap-0 justify-center"
                  )}>
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-black/60 transition-colors">
                      <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    
                    <div className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-700 flex-1",
                      isActive ? "opacity-100 max-w-[400px] ml-4" : "opacity-0 max-w-0 ml-0"
                    )}>
                      <h3 className="text-lg lg:text-2xl font-serif text-white tracking-wide">{feature.title}</h3>
                    </div>
                  </div>

                  <div className={cn(
                    "overflow-hidden transition-all duration-700 relative z-10",
                    isActive ? "max-h-[150px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
                  )}>
                    <p className="text-white/90 text-xs lg:text-base line-clamp-3 leading-relaxed whitespace-normal min-w-[200px] lg:min-w-[250px]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
