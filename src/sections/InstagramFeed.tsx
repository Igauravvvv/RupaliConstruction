import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";

export default function InstagramFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://elfsightcdn.com/platform.js';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
          }
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mt-24 pt-16 text-center">
      <p className="text-[10px] font-bold tracking-[0.2em] text-[#E1306C] uppercase mb-2">Join the Community</p>
      <a 
        href="https://instagram.com/rupali_construction_" 
        target="_blank" 
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#E1306C] transition-colors mb-10"
      >
        <Instagram className="w-5 h-5" />
        <span className="font-serif italic text-lg">@rupali_construction_</span>
      </a>
      
      <div className="w-full max-w-7xl mx-auto min-h-[500px] flex justify-center overflow-hidden">
        <div 
          className="elfsight-app-82a789c4-5923-4ea3-bac7-cf0fc05bde43 w-full" 
          data-elfsight-app-lazy 
          style={{ width: '100%', maxWidth: '100%', display: 'block' }}
        ></div>
      </div>
    </div>
  );
}
