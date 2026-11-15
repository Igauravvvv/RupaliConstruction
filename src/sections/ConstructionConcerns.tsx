import { ArrowUpRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import { constructionConcerns } from "../../shared/construction-concerns";

const answers = [
  "Clear scope. Agreed specifications. Milestone payments.",
  "A staged plan, with regular progress updates.",
  "Review material brands and samples before we build.",
];

export default function ConstructionConcerns() {
  const reduceMotion = useReducedMotion();
  return <section id="building-concerns" aria-labelledby="construction-concerns" className="overflow-hidden bg-[#F5F4F0] py-12 sm:py-20">
    <div className="container-rc max-w-5xl">
      <div className="mb-8 sm:mb-12">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--rc-orange)]">A clearer way to build</p>
        <h2 id="construction-concerns" className="font-serif text-3xl leading-[1.1] text-[var(--rc-dark)] sm:text-5xl lg:text-6xl">Your questions.<br /><span className="italic">A clearer way forward.</span></h2>
      </div>
      <div className="flex flex-col gap-5 sm:gap-7">
        {constructionConcerns.slice(0, 3).map((item, index) => <motion.article key={item.concern}
          initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 32 : -32, y: 8 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.6, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-[95%] rounded-2xl border border-[var(--rc-blue)]/10 bg-white p-5 shadow-[0_8px_30px_-24px_rgba(11,46,89,0.3)] sm:w-[88%] sm:p-7 ${index % 2 ? "ml-auto" : "mr-auto"}`}>
          <div className="flex items-start gap-4 sm:gap-6">
            <span className="mt-1 font-mono text-xs text-[var(--rc-orange)] sm:text-sm">0{index + 1}</span>
            <div><h3 className="text-lg font-medium leading-snug tracking-tight text-[var(--rc-blue)] sm:text-2xl">{item.question}</h3>
              <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[var(--rc-muted)]"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--rc-orange)]" aria-hidden="true" />{answers[index]}</p>
            </div>
          </div>
        </motion.article>)}
      </div>
      <div className="mt-7 flex justify-center sm:mt-10"><Link to="/building-guide-gurgaon" className="inline-flex min-h-11 items-center gap-3 rounded-full border border-[var(--rc-blue)]/20 px-5 py-3 text-sm font-medium text-[var(--rc-blue)] hover:bg-white">What to ask your builder<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
    </div>
  </section>;
}
