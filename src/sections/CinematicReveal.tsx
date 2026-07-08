import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section and animate elements based on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=120%", // Reduced from 200% to make the scroll transition faster
          pin: true,
          scrub: 1,
        },
      });

      // 1. Text fades in and scales up slightly
      tl.to(textRef.current, { scale: 1, opacity: 1, duration: 1 })
      // 2. Text fades out while scaling up, and image fades in
        .to(textRef.current, { scale: 1.3, opacity: 0, duration: 1 })
        .to(imageRef.current, { opacity: 1, scale: 1.05, duration: 1 }, "<")
      // 3. New content fades in and slides up
        .to(contentRef.current, { opacity: 1, y: 0, duration: 1 }, "<0.5")
      // 4. Image slowly zooms in further
        .to(imageRef.current, { scale: 1.15, duration: 1.5 }, "<");
        
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[var(--rc-dark)]">
      {/* Architecture Image (Initially hidden) */}
      <img
        ref={imageRef}
        src="/assets/images/cinematic_architecture.png"
        alt="Modern Architecture"
        className="absolute inset-0 w-full h-full object-cover origin-center opacity-0 scale-100"
      />

      {/* Cinematic Text Overlay (Vision to Reality) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div ref={textRef} className="text-center opacity-0 scale-90">
          <h2 className="text-7xl md:text-[12rem] leading-none font-serif italic text-white drop-shadow-2xl">
            Vision
          </h2>
          <p className="text-[var(--rc-orange)] font-mono text-xl md:text-3xl tracking-[0.5em] md:tracking-[0.8em] mt-4 md:mt-8 uppercase font-bold drop-shadow-sm">
            To Reality
          </p>
        </div>
      </div>

      {/* Revealed Content Overlay (Features & CTA) */}
      <div 
        ref={contentRef} 
        className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none opacity-0"
        style={{ transform: "translateY(50px)" }}
      >
        <div className="max-w-3xl pointer-events-auto">
          <p className="text-[var(--rc-orange)] font-mono text-sm tracking-[0.2em] uppercase mb-4 font-bold">
            Uncompromising Excellence
          </p>
          <h3 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
            Where architecture meets <span className="italic font-light">art.</span>
          </h3>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            We don't just build structures; we craft iconic landmarks. Explore our portfolio of ultra-luxury residences and cutting-edge commercial spaces designed to leave a lasting legacy.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary pointer-events-auto">
              Explore Portfolio
            </button>
            <button className="px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border border-white/30 text-white hover:bg-white hover:text-black">
              Start A Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
