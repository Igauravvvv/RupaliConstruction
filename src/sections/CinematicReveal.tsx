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
          end: "+=100%", // Tighter scroll for faster section transition
          pin: true,
          scrub: 1,
        },
      });

      // 1. Text fades in and scales up slightly
      tl.to(textRef.current, { scale: 1, opacity: 1, duration: 1 })
      // 2. Text fades out while scaling up, and image fades in
        .to(textRef.current, { scale: 1.3, opacity: 0, duration: 1 })
        .to(imageRef.current, { opacity: 1, scale: 1, duration: 1 }, "<")
      // 3. New content fades in and slides up
        .to(contentRef.current, { opacity: 1, y: 0, duration: 1 }, "<0.5")
      // 4. Image remains unscaled
        .to(imageRef.current, { scale: 1, duration: 1.5 }, "<");
        
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="cinematic-reveal-section" ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[var(--rc-dark)]">
      {/* Architecture Image (Initially hidden) */}
      <img
        ref={imageRef}
        src="/assets/images/cinematic_architecture.webp"
        alt="Modern Architecture"
        className="absolute inset-0 w-full h-full object-cover object-[center_40%] origin-center opacity-0 scale-100 will-change-transform"
      />

      {/* Cinematic Text Overlay (Vision to Reality) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div ref={textRef} className="text-center opacity-0 scale-90 will-change-transform">
          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[11rem] leading-none font-serif italic text-white drop-shadow-2xl">
            Vision
          </h2>
          <p className="text-[var(--rc-orange)] font-mono text-base sm:text-lg md:text-2xl lg:text-3xl tracking-[0.4em] md:tracking-[0.6em] lg:tracking-[0.8em] mt-3 md:mt-6 uppercase font-bold drop-shadow-sm">
            To Reality
          </p>
        </div>
      </div>

      <div 
        ref={contentRef} 
        className="absolute inset-0 flex flex-col justify-start pt-24 md:pt-28 lg:pt-36 px-6 md:px-16 lg:px-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none opacity-0"
        style={{ transform: "translateY(50px)" }}
      >
        <div className="max-w-3xl pointer-events-auto">
          <p className="text-[var(--rc-orange)] font-mono text-sm tracking-[0.2em] uppercase mb-4 font-bold drop-shadow-md">
            Uncompromising Excellence
          </p>
          <h3 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-6 drop-shadow-lg">
            Where architecture meets <span className="italic font-light">art.</span>
          </h3>
          <p className="text-gray-100 text-base md:text-lg mb-10 max-w-2xl leading-relaxed drop-shadow-md">
            We don't just build structures; we craft iconic landmarks. Explore our portfolio of ultra-luxury residences and cutting-edge commercial spaces designed to leave a lasting legacy.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/projects" className="px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 bg-[var(--rc-orange)] text-white hover:brightness-110 shadow-lg hover:shadow-[0_0_20px_rgba(255,90,31,0.5)] pointer-events-auto inline-block text-center">
              Explore Projects
            </a>
            <a href="/contact" className="px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border border-white/50 text-white hover:bg-white hover:text-black pointer-events-auto shadow-lg inline-block text-center">
              Start A Project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
