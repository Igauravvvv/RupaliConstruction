import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
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
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-24 bg-[var(--rc-white)]">
      <div className="container-rc">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-label text-[var(--rc-orange)] mb-3">FAQ</p>
            <h2 className="text-display-2 text-[var(--rc-dark)] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--rc-muted)] leading-snug">
              Got questions about building with us? Here are answers to the most
              common queries from our clients. For more details, feel free to
              reach out directly.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-[var(--rc-border)] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--rc-gray)]/50 transition-colors"
                >
                  <span className="font-medium text-sm text-[var(--rc-dark)] pr-4 leading-tight">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--rc-blue)] flex-shrink-0 transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open === i ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-3 pb-2.5 text-sm text-[var(--rc-muted)] leading-snug">
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
