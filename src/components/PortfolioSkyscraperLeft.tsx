import { motion } from "framer-motion";

export default function PortfolioSkyscraperLeft({ className = "", colorClass = "text-[var(--rc-blue)]" }: { className?: string, colorClass?: string }) {
  return (
    <div className={`absolute pointer-events-none flex items-end justify-center overflow-visible ${className}`}>
      <svg
        viewBox="0 0 300 1000"
        className={`w-[150px] h-full md:w-[240px] lg:w-[300px] ${colorClass} overflow-visible`}
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        >
          {/* Base */}
          <path vectorEffect="non-scaling-stroke" d="M 100 1000 L 100 900 L 200 900 L 200 1000" />
          
          {/* Circular/Cylindrical Body */}
          <path vectorEffect="non-scaling-stroke" d="M 100 900 Q 80 500 100 200 Q 150 150 200 200 Q 220 500 200 900" />
          
          {/* Grid lines to make it look 3D cylindrical */}
          <path vectorEffect="non-scaling-stroke" d="M 100 800 Q 150 820 200 800" />
          <path vectorEffect="non-scaling-stroke" d="M 95 700 Q 150 720 205 700" />
          <path vectorEffect="non-scaling-stroke" d="M 90 600 Q 150 620 210 600" />
          <path vectorEffect="non-scaling-stroke" d="M 88 500 Q 150 520 212 500" />
          <path vectorEffect="non-scaling-stroke" d="M 90 400 Q 150 420 210 400" />
          <path vectorEffect="non-scaling-stroke" d="M 95 300 Q 150 320 205 300" />
          
          {/* Vertical curve lines */}
          <path vectorEffect="non-scaling-stroke" d="M 130 900 Q 120 500 130 200" />
          <path vectorEffect="non-scaling-stroke" d="M 170 900 Q 180 500 170 200" />
          
          {/* Pointed top */}
          <path vectorEffect="non-scaling-stroke" d="M 100 200 Q 150 150 200 200 L 150 50 Z" />
          <line vectorEffect="non-scaling-stroke" x1="150" y1="50" x2="150" y2="-50" strokeWidth="2" />
        </motion.g>

        {/* Animated Tracing Line (Left) */}
        <motion.path 
          vectorEffect="non-scaling-stroke"
          d="M 100 1000 L 100 900 Q 80 500 100 200 Q 150 150 150 50 L 150 -50"
          stroke="var(--rc-blue)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
        />
        
        {/* Animated Tracing Line (Right) */}
        <motion.path 
          vectorEffect="non-scaling-stroke"
          d="M 200 1000 L 200 900 Q 220 500 200 200 Q 150 150 150 50 L 150 -50"
          stroke="var(--rc-blue)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
        />
      </svg>
    </div>
  );
}
