import ConstructionEstimator from "@/components/ConstructionEstimator";
import { motion } from "framer-motion";

export default function EstimateSection() {
  return (
    <section id="estimate" className="py-24 bg-[var(--rc-white)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--rc-gray)] rounded-l-3xl -z-10 hidden xl:block" />
      
      <div className="container-rc flex flex-col items-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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

        {/* Indexable SEO & AI Overviews Summary Table */}
        <div className="mt-16 w-full max-w-5xl bg-[#F8F9FA] rounded-3xl p-6 sm:p-10 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--rc-orange)] mb-1">
                2026 Construction Cost Benchmarks
              </p>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--rc-dark)]">
                Average Independent House Construction Rates in Gurugram
              </h3>
            </div>
            <a
              href="/blog/cost-of-building-house-gurgaon"
              className="text-xs sm:text-sm font-semibold text-[var(--rc-blue)] hover:text-[var(--rc-orange)] underline underline-offset-4 transition-colors"
            >
              Read Complete 2026 Cost Guide &rarr;
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Specification Tier</th>
                  <th className="py-3 px-3">Cost / Sq. Ft.</th>
                  <th className="py-3 px-3">Structural Materials</th>
                  <th className="py-3 px-3">Finishing Standards</th>
                  <th className="py-3 px-3">Best Suited For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[var(--rc-dark)]">Standard</td>
                  <td className="py-3.5 px-3 font-semibold text-[var(--rc-blue)]">₹1,600 – ₹1,900</td>
                  <td className="py-3.5 px-3">Fe-500 Steel, Ambuja/ACC 43, Red Clay Bricks</td>
                  <td className="py-3.5 px-3">Double-charged Vitrified Tiles, Cera/Hindware Fittings</td>
                  <td className="py-3.5 px-3">Rental floors, standard family homes</td>
                </tr>
                <tr className="hover:bg-white/60 transition-colors bg-white/40">
                  <td className="py-3.5 px-3 font-bold text-[var(--rc-dark)]">Premium Turnkey</td>
                  <td className="py-3.5 px-3 font-semibold text-[var(--rc-orange)]">₹2,100 – ₹2,600</td>
                  <td className="py-3.5 px-3">UltraTech M25, Tata/JSW Fe-500D, AAC Blocks</td>
                  <td className="py-3.5 px-3">Fenesta UPVC, 4x2 Porcelain / Indian Marble, Kohler</td>
                  <td className="py-3.5 px-3">Modern villas in Sector 57, 43, 71, Sushant Lok</td>
                </tr>
                <tr className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-[var(--rc-dark)]">Ultra Bespoke</td>
                  <td className="py-3.5 px-3 font-semibold text-[var(--rc-dark)]">₹2,800 – ₹3,500+</td>
                  <td className="py-3.5 px-3">M30 Concrete, Tata Tiscon Fe-550D, Raft Foundation</td>
                  <td className="py-3.5 px-3">Italian Statuario Marble, Schüco Slim Windows, Grohe/Bravat</td>
                  <td className="py-3.5 px-3">Signature luxury estates in DLF 1–5, Golf Course Rd</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[11px] sm:text-xs text-gray-500 leading-relaxed">
            * All estimates exclude land registry, exterior municipal road-cutting charges, and interior loose furniture. Every project executed by Rupali Construction includes an engineering soil test (SPT), Seismic Zone IV structural design, and a 10-year structural stability warranty.
          </p>
        </div>
      </div>
    </section>
  );
}
