import { Link } from "react-router";
import { localFaqs } from "../../shared/local-seo";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  ...localFaqs,
  {
    question: "How long does construction typically take?",
    answer: "Standard residential projects (2000-3000 sq ft) typically take 8-12 months. Commercial timelines vary. A detailed schedule is provided during planning.",
  },
  {
    question: "Do you offer architectural design services?",
    answer: "Yes, our in-house team handles everything from concept to working drawings. We can also collaborate with your preferred external architect.",
  },
  {
    question: "What are the payment stages?",
    answer: "We use a milestone-based structure: 20% at booking, foundation, structure, finishing, and handover. You only pay as work progresses.",
  },
  {
    question: "Can I track the construction progress?",
    answer: "Yes. Clients get access to a live portal for daily photos, milestone updates, and direct communication with the site supervisor.",
  },
  {
    question: "Do you provide material quality guarantees?",
    answer: "Yes, we use certified vendors, provide test certificates for critical materials, and offer a 5-year structural warranty.",
  },
  {
    question: "What areas do you serve?",
    answer: "We primarily serve Delhi NCR (Gurgaon, Noida, Faridabad, Ghaziabad). Large-scale projects may extend across North India.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <section aria-labelledby="faq-heading" className="py-12 lg:py-24 bg-[var(--rc-white)]">
      <div className="container-rc">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-label text-[var(--rc-orange)] mb-3">Good to know</p>
            <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--rc-dark)] mb-3">Questions, answered.</h2>
            <p className="text-sm sm:text-base text-[var(--rc-muted)] leading-relaxed max-w-md">
              A little clarity before you build. Explore the essentials here or read our{" "}
              <Link to="/building-guide-gurgaon" className="text-[var(--rc-blue)] underline underline-offset-4">homeowner guide</Link>.
            </p>
          </div>
          <div>
            <div className="flex flex-col gap-2" id="faq-list">
              {faqs.map((faq, i) => (
                <div key={faq.question} className={`${i >= 4 && !showAll ? "hidden sm:block" : ""} border rounded-2xl overflow-hidden transition-colors ${open === i ? "border-[var(--rc-blue)]/20 bg-slate-50" : "border-[var(--rc-border)] bg-white"}`}>
                  <button aria-expanded={open === i} aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-sm sm:text-base text-[var(--rc-dark)] leading-snug">{faq.question}</span>
                    <ChevronDown aria-hidden="true" className={`w-4 h-4 text-[var(--rc-orange)] shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  <div id={`faq-answer-${i}`} hidden={open !== i}>
                    <p className="px-4 pb-4 text-sm text-[var(--rc-muted)] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" aria-expanded={showAll} aria-controls="faq-list"
              onClick={() => { setShowAll(!showAll); if (showAll && open !== null && open >= 4) setOpen(null); }}
              className="sm:hidden w-full mt-4 py-3 rounded-full border border-[var(--rc-border)] text-sm font-semibold text-[var(--rc-blue)] hover:bg-slate-50">
              {showAll ? "Show fewer questions" : `Show all ${faqs.length} questions`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
