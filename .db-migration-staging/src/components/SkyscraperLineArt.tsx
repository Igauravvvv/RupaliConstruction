import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SkyscraperLineArt({ className = "opacity-10", colorClass = "text-[var(--rc-blue)]" }: { className?: string, colorClass?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none flex items-end justify-center overflow-visible ${className}`}>
      <motion.div
        animate={{
          x: mousePosition.x * -1,
          y: mousePosition.y * -1,
          rotateZ: [0, 0.5, 0, -0.5, 0],
        }}
        transition={{
          rotateZ: {
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          },
          x: { type: "spring", stiffness: 40, damping: 25 },
          y: { type: "spring", stiffness: 40, damping: 25 },
        }}
        className="relative w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]"
      >
        {/* Blueprint SVG Grid */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprint-grid-sky" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className={`${colorClass} opacity-20`} />
            </pattern>
            <pattern id="windows-grid" width="30" height="40" patternUnits="userSpaceOnUse">
              <rect x="5" y="5" width="20" height="30" fill="none" stroke="currentColor" strokeWidth="1" className={`${colorClass} opacity-40`} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid-sky)" />
        </svg>
        
        {/* Architectural Line Art Skyscraper */}
        <svg
          viewBox="0 0 800 800"
          className={`absolute inset-0 w-full h-full ${colorClass} overflow-visible`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Background Layer (Moves Slowest) - Distant Towers */}
          <motion.g
            initial={{ strokeDasharray: 3000, strokeDashoffset: 3000, opacity: 0 }}
            whileInView={{ strokeDashoffset: 0, opacity: 0.2, x: mousePosition.x * 0.4, y: mousePosition.y * 0.4 }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 4, ease: "easeOut" }}
          >
            <rect x="200" y="300" width="120" height="500" />
            <path d="M 200 300 L 260 250 L 320 300" />
            
            <rect x="550" y="250" width="140" height="550" />
            <path d="M 550 250 L 620 200 L 690 250" />
            <line x1="620" y1="200" x2="620" y2="100" strokeWidth="2" />
          </motion.g>

          {/* Midground Layer (Main Structure) - Central Skyscraper */}
          <motion.g
            initial={{ strokeDasharray: 4000, strokeDashoffset: 4000, opacity: 0 }}
            whileInView={{ strokeDashoffset: 0, opacity: 0.6, x: mousePosition.x * 0.8, y: mousePosition.y * 0.8 }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
          >
            {/* Main Body */}
            <rect x="360" y="100" width="140" height="700" />
            <rect x="360" y="100" width="140" height="700" fill="url(#windows-grid)" stroke="none" />
            
            {/* Tiers / Crown */}
            <rect x="380" y="50" width="100" height="50" />
            <rect x="400" y="10" width="60" height="40" />
            
            {/* Spire */}
            <line x1="430" y1="10" x2="430" y2="-70" strokeWidth="2" />

            {/* Tracing Blue Line (Left) */}
            <motion.path 
              d="M 360 800 L 360 100 L 380 100 L 380 50 L 400 50 L 400 10 L 430 10 L 430 -70"
              stroke="var(--rc-blue)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
            />
            
            {/* Tracing Blue Line (Right) */}
            <motion.path 
              d="M 500 800 L 500 100 L 480 100 L 480 50 L 460 50 L 460 10 L 430 10 L 430 -70"
              stroke="var(--rc-blue)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
            />
          </motion.g>

          {/* Foreground Layer (Moves Fastest) - Base and Ground */}
          <motion.g
            initial={{ strokeDasharray: 2000, strokeDashoffset: 2000, opacity: 0 }}
            whileInView={{ strokeDashoffset: 0, opacity: 1, x: mousePosition.x * 1.5, y: mousePosition.y * 1.5 }}
            viewport={{ once: false, margin: "100px" }}
            transition={{ duration: 2.5, delay: 1, ease: "easeOut" }}
          >
            <path d="M 0 780 L 800 780" strokeWidth="3" className="text-[var(--rc-dark)]" />
            
            {/* Modern glassy entrance pavilion */}
            <rect x="250" y="650" width="100" height="130" />
            <path d="M 250 650 L 350 600 L 350 780" />
            
            <rect x="510" y="600" width="150" height="180" />
            <path d="M 510 650 L 660 650 M 510 700 L 660 700" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
