import { motion } from "framer-motion";

export default function PortfolioSkyscraperRight({ className = "", colorClass = "text-[var(--rc-blue)]" }: { className?: string, colorClass?: string }) {
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
          <path vectorEffect="non-scaling-stroke" d="M 50 1000 L 50 850 L 250 850 L 250 1000" />
          
          {/* Angular stepped body */}
          <path vectorEffect="non-scaling-stroke" d="M 80 850 L 80 600 L 120 600 L 120 350 L 140 350 L 140 150 L 160 150 L 160 350 L 180 350 L 180 600 L 220 600 L 220 850" />
          
          {/* Diagonal modern cross braces */}
          <path vectorEffect="non-scaling-stroke" d="M 80 850 L 220 600" />
          <path vectorEffect="non-scaling-stroke" d="M 220 850 L 80 600" />
          <path vectorEffect="non-scaling-stroke" d="M 120 600 L 180 350" />
          <path vectorEffect="non-scaling-stroke" d="M 180 600 L 120 350" />
          <path vectorEffect="non-scaling-stroke" d="M 140 350 L 160 150" />
          <path vectorEffect="non-scaling-stroke" d="M 160 350 L 140 150" />
          
          {/* Spire */}
          <path vectorEffect="non-scaling-stroke" d="M 150 150 L 150 -50" strokeWidth="2" />
        </motion.g>

        {/* Animated Tracing Line (Left Side Steps) */}
        <motion.path 
          vectorEffect="non-scaling-stroke"
          d="M 80 1000 L 80 850 L 80 600 L 120 600 L 120 350 L 140 350 L 140 150 L 150 150 L 150 -50"
          stroke="var(--rc-blue)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
        />
        
        {/* Animated Tracing Line (Right Side Steps) */}
        <motion.path 
          vectorEffect="non-scaling-stroke"
          d="M 220 1000 L 220 850 L 220 600 L 180 600 L 180 350 L 160 350 L 160 150 L 150 150 L 150 -50"
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
