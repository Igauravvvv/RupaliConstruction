import { useEffect, createContext, useContext, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false, // Keep native 120Hz smooth touch on mobile
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    setLenisInstance(lenis);

    // Synchronize Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Handle hash links globally
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.pathname === window.location.pathname) {
        const id = anchor.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -80 }); // Offset for sticky navbar
          // Update URL without jump
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };

    document.documentElement.addEventListener('click', handleHashClick);

    return () => {
      document.documentElement.removeEventListener('click', handleHashClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
