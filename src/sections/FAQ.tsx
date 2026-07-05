import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does construction typically take?",
    answer: "For a standard residential project of 2000-3000 sq ft, construction typically takes 8-12 months from foundation to handover. Commercial projects vary based on scale and complexity. We provide a detailed timeline during the planning phase and keep you updated throughout.",
  },
  {
    question: "Do you offer architectural design services?",
    answer: "Yes, we have an in-house team of architects and structural engineers who can handle everything from initial concept design to detailed working drawings. We also collaborate with external architects if you have a preferred designer.",
  },
  {
    question: "What are the payment stages?",
    answer: "We follow a milestone-based payment structure: 20% at booking, 20% at foundation, 20% at structure completion, 20% at finishing stage, and 20% at handover. This ensures you pay only as work progresses.",
  },
  {
    question: "Can I track the construction progress?",
    answer: "Absolutely. All our clients get access to our live project tracking portal where you can view daily photo updates, material logs, milestone updates, and communicate directly with the site supervisor.",
  },
  {
    question: "Do you provide material quality guarantees?",
    answer: "Yes, we source all materials from certified vendors and provide quality test certificates for critical materials like cement, steel, and concrete. We also offer a 5-year structural warranty on all our projects.",
  },
  {
    question: "What areas do you serve?",
    answer: "We primarily serve Gurgaon and the Delhi NCR region including Noida, Faridabad, and Ghaziabad. For large-scale projects, we also undertake work in other major cities across North India.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-32 bg-[var(--rc-white)]">
      <div className="container-rc">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-label text-[var(--rc-orange)] mb-4">FAQ</p>
            <h2 className="text-display-2 text-[var(--rc-dark)] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--rc-muted)] leading-relaxed">
              Got questions about building with us? Here are answers to the most
              common queries from our clients. For more details, feel free to
              reach out directly.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-[var(--rc-border)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--rc-gray)]/50 transition-colors"
                >
                  <span className="font-medium text-[var(--rc-dark)] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--rc-blue)] flex-shrink-0 transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open === i ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-[var(--rc-muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
