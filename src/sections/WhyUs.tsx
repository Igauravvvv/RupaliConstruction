import { DollarSign, Layers, ShieldCheck, Radio, Users } from "lucide-react";
import { motion } from "framer-motion";
import SkyscraperLineArt from "@/components/SkyscraperLineArt";

const features = [
  {
    icon: DollarSign,
    title: "Fixed Pricing",
    desc: "No hidden costs. Complete clarity on every rupee spent. Our transparent pricing model ensures you know exactly what you're paying for.",
  },
  {
    icon: Layers,
    title: "Stage-wise Payments",
    desc: "Pay only as construction progresses. Milestone-based payment structure keeps you in control of your investment.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Checks",
    desc: "Multiple inspections at every milestone. Our rigorous quality assurance process ensures structural integrity at every phase.",
  },
  {
    icon: Radio,
    title: "Live Tracking",
    desc: "Track your project in real-time. Get daily photo updates, material logs, and progress reports directly on your device.",
  },
  {
    icon: Users,
    title: "Expert Team",
    desc: "Architects, engineers, and site managers with decades of combined experience in premium construction across NCR.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--rc-white)] relative overflow-hidden">
      <SkyscraperLineArt className="opacity-40 scale-50 md:scale-75 absolute left-0 -translate-x-1/3 origin-bottom-left" colorClass="text-[var(--rc-blue)]" />
      <div className="absolute inset-0 pointer-events-none scale-x-[-1]">
        <SkyscraperLineArt className="opacity-40 scale-50 md:scale-75 absolute left-0 -translate-x-1/3 origin-bottom-left" colorClass="text-[var(--rc-blue)]" />
      </div>
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
            variants={{ hidden: { opacity: 0, x: "-100vw" }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.1 } } }}
            className="text-3xl md:text-4xl font-serif italic tracking-wide text-[var(--rc-orange)] mb-4"
          >
            Why Choose Us
          </motion.p>
          <motion.h2 
            variants={{ hidden: { opacity: 0, x: "-100vw" }, visible: { opacity: 1, x: 0, transition: { duration: 1.5, type: "spring", bounce: 0.1 } } }}
            className="text-display-2 text-[var(--rc-dark)] max-w-4xl mx-auto whitespace-nowrap"
          >
            The Rupali Advantage
          </motion.h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] feature-card group p-8 rounded-2xl border border-[var(--rc-border)] bg-white hover:bg-[var(--rc-orange)] hover:border-[var(--rc-orange)] hover:shadow-2xl hover:shadow-[var(--rc-orange)]/20 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--rc-blue)]/10 flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[var(--rc-blue)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--rc-dark)] group-hover:text-white mb-3 transition-colors">
                {feature.title}
              </h3>
              <p className="text-[var(--rc-muted)] group-hover:text-white/90 leading-relaxed transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
