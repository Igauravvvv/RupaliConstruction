import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Category } from "@/data/brandStandardsData";
import SubCategoryRow from "./SubCategoryRow";

interface CategoryCardProps {
  category: Category;
  index: number;
  isMobile: boolean;
}

export default function CategoryCard({
  category,
  index,
  isMobile,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const Icon = category.icon;

  const expand = useCallback(() => setIsExpanded(true), []);
  const collapse = useCallback(() => setIsExpanded(false), []);

  // Desktop: hover to expand. Mobile: tap to toggle.
  const interactionProps = isMobile
    ? { onClick: () => setIsExpanded((p) => !p) }
    : { onMouseEnter: expand, onMouseLeave: collapse };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative"
      data-interactive="true"
    >
      <motion.div
        {...interactionProps}
        animate={{
          scale: isExpanded ? 1 : 1,
        }}
        whileHover={
          shouldReduceMotion ? {} : { scale: 1.02, y: -2 }
        }
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative rounded-2xl border border-[var(--rc-border)] bg-white overflow-hidden
                   cursor-pointer select-none"
        style={{
          boxShadow: isExpanded
            ? `0 20px 60px -12px ${category.color}20, 0 8px 24px -8px rgba(0,0,0,0.08)`
            : "0 1px 3px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Header */}
        <div className="relative px-6 py-6 sm:py-8">
          {/* Decorative gradient bar at top */}
          <div
            className="absolute top-0 inset-x-0 h-1 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, ${category.color}, ${category.color}88)`,
              opacity: isExpanded ? 1 : 0.3,
            }}
          />

          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: isExpanded ? 8 : 0,
                scale: isExpanded ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${category.color}15, ${category.color}08)`,
                border: `1px solid ${category.color}20`,
              }}
            >
              <Icon
                className="w-6 h-6 sm:w-7 sm:h-7"
                style={{ color: category.color }}
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg sm:text-xl font-bold transition-colors duration-300"
                style={{ color: isExpanded ? category.color : "var(--rc-dark)" }}
              >
                {category.name}
              </h3>
              <p className="text-xs text-[var(--rc-muted)] mt-0.5">
                {category.subcategories.length}{" "}
                {category.subcategories.length === 1
                  ? "sub-category"
                  : "sub-categories"}
              </p>
            </div>

            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isExpanded
                  ? `${category.color}10`
                  : "transparent",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="transition-colors duration-200"
                style={{
                  color: isExpanded ? category.color : "var(--rc-muted)",
                }}
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Expanded content: sub-categories */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--rc-border)] mx-6" />
              <div className="px-2 py-3 space-y-0.5">
                {category.subcategories.map((sub) => (
                  <SubCategoryRow
                    key={sub.name}
                    subcategory={sub}
                    categoryColor={category.color}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
