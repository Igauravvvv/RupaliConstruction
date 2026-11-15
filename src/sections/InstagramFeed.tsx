import { useEffect, useRef } from "react";
import { ArrowUpRight, Instagram } from "lucide-react";

const instagramUrl = "https://www.instagram.com/rupali_construction_/reels/";

export default function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
        const script = document.createElement("script");
        script.src = "https://elfsightcdn.com/platform.js";
        script.async = true;
        document.body.appendChild(script);
      }
      observer.disconnect();
    }, { rootMargin: "400px" });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} aria-labelledby="instagram-heading" className="bg-[var(--rc-gray)] pb-12 pt-4 sm:pb-16">
      <div className="container-rc">
        <div className="mb-6 flex flex-col items-start justify-between gap-5 sm:mb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--rc-orange)]"><Instagram className="h-4 w-4" aria-hidden="true" />Beyond the blueprints</p>
            <h2 id="instagram-heading" className="font-serif text-4xl leading-tight text-[var(--rc-dark)] sm:text-5xl">Follow the <span className="italic">build.</span></h2>
            <p className="mt-3 text-sm text-[var(--rc-muted)]">The latest reels, walkthroughs and site stories from our Instagram.</p>
          </div>
          <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--rc-border)] bg-white px-5 py-3 text-xs font-semibold text-[var(--rc-blue)] transition-colors hover:border-[var(--rc-orange)]">Watch on Instagram<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
        </div>
        <div className="w-full overflow-hidden rounded-2xl sm:rounded-3xl">
          <div className="elfsight-app-82a789c4-5923-4ea3-bac7-cf0fc05bde43 w-full" data-elfsight-app-lazy style={{ width: "100%", maxWidth: "100%", display: "block" }} />
        </div>
        <a href={instagramUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center text-xs text-[var(--rc-muted)] hover:text-[var(--rc-blue)]">@rupali_construction_<ArrowUpRight className="ml-1 h-3 w-3" aria-hidden="true" /></a>
      </div>
    </section>
  );
}
