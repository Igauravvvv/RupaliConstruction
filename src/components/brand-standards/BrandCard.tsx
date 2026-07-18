import { motion, useReducedMotion } from "framer-motion";
import type { Brand } from "@/data/brandStandardsData";
import { AlertTriangle, Info } from "lucide-react";

interface BrandCardProps {
  brand: Brand;
  index: number;
  categoryColor: string;
}

export default function BrandCard({ brand, index, categoryColor }: BrandCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        ease: [0.25, 1, 0.5, 1],
      }}
      className="group/brand relative h-[320px] sm:h-[400px] w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      {/* Background Image Area */}
      <div className="absolute inset-0 bg-gray-100">
        {brand.image ? (
          <img
            src={brand.image}
            alt={brand.name}
            className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/brand:scale-110"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                const placeholder = parent.querySelector(".brand-placeholder") as HTMLElement;
                if (placeholder) placeholder.style.display = "flex";
              }
            }}
          />
        ) : null}
        
        {/* Placeholder Fallback */}
        <div
          className="brand-placeholder absolute inset-0 items-center justify-center"
          style={{ display: brand.image ? "none" : "flex" }}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center text-white font-bold"
            style={{
              background: `linear-gradient(135deg, var(--rc-dark) 0%, ${categoryColor} 100%)`,
            }}
          >
            <span className="text-4xl mb-4 opacity-50">
              {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
            <span className="text-sm uppercase tracking-widest opacity-70">Image Pending</span>
          </div>
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--rc-dark)]/90 via-[var(--rc-dark)]/40 to-transparent transition-opacity duration-500 group-hover/brand:opacity-90" />
      </div>

      {/* Floating Confirm Badge */}
      {!brand.confirmed && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[var(--rc-orange)] text-white bg-[var(--rc-orange)]/80 backdrop-blur-md shadow-lg z-20">
          <AlertTriangle className="w-3.5 h-3.5" />
          Verify
        </div>
      )}

      {/* Content Area (Glassmorphism Bottom Bar) */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col justify-end h-full z-10 pointer-events-none">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] translate-y-4 group-hover/brand:translate-y-0 transition-transform duration-500 ease-out">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="text-xl sm:text-2xl font-serif text-white leading-tight">
              {brand.name}
            </h4>
            <Info className="w-5 h-5 text-white/50 group-hover/brand:text-[var(--rc-orange)] transition-colors duration-300 mt-1 flex-shrink-0" />
          </div>
          
          <div className="overflow-hidden">
            <p className="text-sm text-white/80 leading-relaxed font-light line-clamp-2 group-hover/brand:line-clamp-none transition-all duration-500">
              {brand.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
