import CostCalculator from "@/components/CostCalculator";
import { motion } from "framer-motion";

export default function EstimateSection() {
  return (
    <section id="estimate" className="py-24 bg-[var(--rc-white)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--rc-gray)] rounded-l-3xl -z-10 hidden lg:block" />
      
      <div className="container-rc">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
              className="text-4xl md:text-5xl font-serif italic tracking-wide text-[var(--rc-orange)] mb-4"
              style={{ fontFamily: "cursive" }}
            >
              Plan Your Budget
            </motion.p>
            <h2 className="text-display-2 text-[var(--rc-dark)] mb-6">
              Get a Free Construction Estimate
            </h2>
            <p className="text-lg text-[var(--rc-muted)] leading-relaxed mb-8">
              Use our interactive calculator to get a rough estimate of your construction costs. 
              Our transparent pricing model ensures you know what to expect before you start.
            </p>
            <ul className="space-y-4">
              {[
                "Instant rough estimates based on current market rates",
                "Adjust parameters like plot size and number of floors",
                "Compare costs across standard, premium, and luxury finishes"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--rc-orange)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--rc-orange)]" />
                  </div>
                  <span className="text-[var(--rc-dark)]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <CostCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
