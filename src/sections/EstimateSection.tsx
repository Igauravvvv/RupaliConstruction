import ConstructionEstimator from "@/components/ConstructionEstimator";
import { motion } from "framer-motion";

export default function EstimateSection() {
  return (
    <section id="estimate" className="py-24 bg-[var(--rc-white)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--rc-gray)] rounded-l-3xl -z-10 hidden xl:block" />
      
      <div className="container-rc flex flex-col items-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.p 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
              className="text-6xl lg:text-[7rem] leading-none font-serif italic text-[var(--rc-orange)] mb-2 drop-shadow-sm"
            >
              Estimate
            </motion.p>
            <h2 className="text-xl md:text-2xl font-medium text-[var(--rc-dark)] mb-6">
              Calculate Your Construction Cost
            </h2>
            <p className="text-lg text-[var(--rc-muted)] leading-relaxed">
              Use our interactive estimator to get a detailed breakdown of your construction costs. 
              Choose a starter package and customize individual materials to fit your exact needs.
            </p>
        </div>
        
        <div className="w-full">
          <ConstructionEstimator />
        </div>
      </div>
    </section>
  );
}
