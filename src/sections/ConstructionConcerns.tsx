import { ArrowDownRight, Check } from "lucide-react";
import { Link } from "react-router";
import { constructionConcerns } from "../../shared/construction-concerns";

export default function ConstructionConcerns() {
  return (
    <section aria-labelledby="construction-concerns" className="py-12 md:py-20 bg-[#F1F3F5]">
      <div className="container-rc">
        <div className="max-w-2xl mb-7 md:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--rc-orange)] mb-3">A clearer way to build</p>
          <h2 id="construction-concerns" className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--rc-dark)] mb-4">Common concerns.<br />Practical solutions.</h2>
          <p className="text-sm md:text-base text-[var(--rc-muted)] leading-relaxed">Building a home should feel exciting, not uncertain. Here is how we approach the concerns homeowners bring to us.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
          {constructionConcerns.map(item => (
            <article key={item.concern} className="rounded-2xl border border-[var(--rc-border)] bg-white p-5 md:p-7">
              <p className="flex items-center gap-2 text-sm text-[var(--rc-muted)] mb-3"><ArrowDownRight className="w-4 h-4 text-[var(--rc-orange)] shrink-0" aria-hidden="true" />{item.concern}</p>
              <h3 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-[var(--rc-dark)] mb-2"><Check className="w-5 h-5 text-[var(--rc-orange)] shrink-0" aria-hidden="true" />{item.approach}</h3>
              <p className="text-sm text-[var(--rc-muted)] leading-relaxed">{item.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--rc-muted)]">Planning a home in Gurgaon or Gurugram? <Link to="/building-guide-gurgaon" className="text-[var(--rc-blue)] font-medium underline underline-offset-4">See what to ask before choosing your contractor.</Link></p>
      </div>
    </section>
  );
}
