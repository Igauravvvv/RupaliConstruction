import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 60, suffix: "+", label: "Years Combined Experience" },
  { value: 12, suffix: "L+", label: "Sq. Ft. Built" },
  { value: 98, suffix: "%", label: "On-Time Delivery" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function TrustBar() {
  return (
    <section className="bg-[var(--rc-white)] border-t border-[var(--rc-border)] py-16 lg:py-24 relative z-10 overflow-hidden">
      <div className="container-rc relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center group flex flex-col items-center">
              <div className="relative inline-block mb-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1.5 }}
                  transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-[var(--rc-orange)]/20 blur-2xl rounded-[100%] pointer-events-none"
                />
                <div className="relative text-6xl lg:text-8xl font-bold bg-[linear-gradient(90deg,var(--rc-blue)_35%,var(--rc-orange)_50%,var(--rc-blue)_65%)] bg-[length:200%_auto] text-transparent bg-clip-text animate-shine drop-shadow-sm">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
              </div>
              <div className="text-label text-[var(--rc-text)]/70 font-bold tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
