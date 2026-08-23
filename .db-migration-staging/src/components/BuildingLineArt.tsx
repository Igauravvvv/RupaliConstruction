import { motion } from "framer-motion";

export default function BuildingLineArt({ className = "opacity-10", colorClass = "text-[var(--rc-blue)]" }: { className?: string, colorClass?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden ${className}`}>
      <div className="relative w-[800px] h-[800px] md:w-[1200px] md:h-[1200px]">
        {/* Blueprint SVG Grid */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className={`${colorClass} opacity-20`} />
            </pattern>
            <pattern id="house-windows" width="40" height="60" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="20" height="40" fill="none" stroke="currentColor" strokeWidth="2" className={`${colorClass} opacity-30`} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        </svg>
        
        {/* Architectural Line Art House */}
        <svg
          viewBox="0 0 800 800"
          className="absolute inset-0 w-full h-full"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Static Background Layer */}
          <g className={`${colorClass} opacity-40`} stroke="currentColor" strokeWidth="3">
            {/* Distant */}
            <path d="M 200 600 L 200 300 L 400 150 L 600 300 L 600 600" />
            <path d="M 250 300 L 250 100 L 350 150" />
            
            {/* Midground */}
            <path d="M 150 650 L 150 350 L 350 200 L 550 350 L 550 650 Z" />
            <path d="M 150 350 L 700 350" />
            <rect x="180" y="380" width="140" height="240" fill="url(#house-windows)" stroke="none" />
            <rect x="380" y="380" width="140" height="240" fill="url(#house-windows)" stroke="none" />
            <rect x="200" y="450" width="80" height="200" />
            <rect x="350" y="400" width="100" height="80" />
            <rect x="350" y="520" width="100" height="80" />
            <path d="M 350 440 L 450 440 M 400 400 L 400 480" />
            <path d="M 350 560 L 450 560 M 400 520 L 400 600" />
            
            {/* Foreground */}
            <path d="M 50 700 L 750 700" strokeWidth="4" />
            <path d="M 100 700 L 100 500 L 250 400 L 400 500 L 400 700" />
            <rect x="150" y="550" width="60" height="150" className="text-[var(--rc-orange)]" />
            <circle cx="280" cy="500" r="30" />
            <path d="M 280 470 L 280 530 M 250 500 L 310 500" />
          </g>

          {/* Animated Orange Tracer Layer */}
          <motion.g 
            className="text-[#c2410c]" 
            stroke="currentColor" 
            strokeWidth="3"
            initial={{ strokeDasharray: "200 800", strokeDashoffset: 4000 }}
            animate={{ strokeDashoffset: [4000, -1000] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {/* Distant */}
            <path d="M 200 600 L 200 300 L 400 150 L 600 300 L 600 600" />
            <path d="M 250 300 L 250 100 L 350 150" />
            
            {/* Midground */}
            <path d="M 150 650 L 150 350 L 350 200 L 550 350 L 550 650 Z" />
            <path d="M 150 350 L 700 350" />
            
            <rect x="200" y="450" width="80" height="200" />
            <rect x="350" y="400" width="100" height="80" />
            <rect x="350" y="520" width="100" height="80" />
            <path d="M 350 440 L 450 440 M 400 400 L 400 480" />
            <path d="M 350 560 L 450 560 M 400 520 L 400 600" />
            
            {/* Foreground */}
            <path d="M 50 700 L 750 700" strokeWidth="4" />
            <path d="M 100 700 L 100 500 L 250 400 L 400 500 L 400 700" />
            <rect x="150" y="550" width="60" height="150" />
            <circle cx="280" cy="500" r="30" />
            <path d="M 280 470 L 280 530 M 250 500 L 310 500" />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
