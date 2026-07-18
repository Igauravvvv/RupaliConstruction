import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { SubCategory } from "@/data/brandStandardsData";
import BrandCard from "./BrandCard";

interface SubCategoryRowProps {
  subcategory: SubCategory;
  categoryColor: string;
  /** On mobile we use tap-to-toggle; on desktop we use hover */
  isMobile: boolean;
}

export default function SubCategoryRow({
  subcategory,
  categoryColor,
  isMobile,
}: SubCategoryRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const toggle = () => setIsOpen((prev) => !prev);

  // Desktop hover handlers
  const hoverHandlers = isMobile
    ? {}
    : {
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
      };

  return (
    <div className="relative" {...hoverHandlers}>
      {/* Sub-category trigger */}
      <button
        onClick={isMobile ? toggle : undefined}
        className="w-full flex items-center gap-3 px-4 py-3 text-left group/sub
                   hover:bg-gray-50/80 rounded-lg transition-colors duration-200"
        data-interactive="true"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        >
          <ChevronRight
            className="w-4 h-4 flex-shrink-0 transition-colors duration-200"
            style={{ color: isOpen ? categoryColor : "var(--rc-muted)" }}
          />
        </motion.div>
        <span
          className="text-sm font-medium transition-colors duration-200"
          style={{
            color: isOpen ? categoryColor : "var(--rc-dark)",
          }}
        >
          {subcategory.name}
        </span>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-[var(--rc-muted)] opacity-50">
          {subcategory.brands.length}{" "}
          {subcategory.brands.length === 1 ? "brand" : "brands"}
        </span>
      </button>

      {/* Level 3: Brand cards */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subcategory.brands.map((brand, idx) => (
                  <BrandCard
                    key={brand.name}
                    brand={brand}
                    index={idx}
                    categoryColor={categoryColor}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
