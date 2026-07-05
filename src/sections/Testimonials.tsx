import { useEffect, useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const { data } = trpc.testimonial.list.useQuery({ limit: 6 });
  const testimonials = data || fallbackTestimonials;
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-24 lg:py-32 bg-[var(--rc-gray)] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-[0.03] translate-x-1/4">
        <img
          src="/logo-icon.png"
          alt=""
          className="w-full max-w-[800px] object-contain"
        />
      </div>
      <div className="container-rc relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="text-4xl md:text-5xl font-serif italic tracking-wide text-[var(--rc-orange)] mb-4"
            style={{ fontFamily: "cursive" }}
          >
            Testimonials
          </motion.p>
          <h2 className="text-display-2 text-[var(--rc-dark)]">
            What Our Clients Say
          </h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div
            ref={sliderRef}
            className="overflow-hidden rounded-2xl bg-white border border-[var(--rc-border)] p-8 lg:p-12"
          >
            <div className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0 flex flex-col items-center text-center"
                >
                  <Quote className="w-10 h-10 text-[var(--rc-orange)]/20 mb-6" />
                  
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-5 h-5 ${
                          j < (t.rating || 5)
                            ? "text-[var(--rc-orange)] fill-[var(--rc-orange)]"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-lg lg:text-xl text-[var(--rc-dark)] leading-relaxed mb-8 max-w-2xl">
                    "{t.content}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--rc-blue)]/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-[var(--rc-blue)]">
                        {(t.name || "C").charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[var(--rc-dark)]">{t.name}</p>
                      {t.location && (
                        <p className="text-sm text-[var(--rc-muted)]">{t.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[var(--rc-blue)] hover:text-white transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[var(--rc-blue)] hover:text-white transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? "w-8 bg-[var(--rc-orange)]"
                    : "bg-[var(--rc-blue)]/20 hover:bg-[var(--rc-blue)]/40"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const fallbackTestimonials = [
  {
    name: "Rajesh Sharma",
    location: "Sector 45, Gurgaon",
    rating: 5,
    content: "Rupali Construction delivered our dream home exactly as promised. The quality of work, transparency in billing, and on-time delivery exceeded our expectations. Highly recommended for anyone looking to build in Gurgaon.",
  },
  {
    name: "Priya Malhotra",
    location: "DLF Phase 2, Gurgaon",
    rating: 5,
    content: "We hired them for a complete renovation of our 15-year-old villa. The transformation was incredible. Their team handled everything from structural changes to interior finishing with utmost professionalism.",
  },
  {
    name: "Amit Gupta",
    location: "Cyber Hub, Gurgaon",
    rating: 5,
    content: "For our commercial office space, Rupali Construction delivered a world-class facility. The project management was excellent, and the live tracking feature kept us updated throughout the construction process.",
  },
];
