import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ArrowLeft, Download, FileText, Phone, CheckCircle2, ShieldCheck } from "lucide-react";
import type { Category, SubCategory, Brand } from "@/data/brandStandardsData";

interface BrandDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function BrandDrawer({ isOpen, onClose, category }: BrandDrawerProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<SubCategory | null>(null);
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);

  // Reset internal state when category changes or drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveSubcategory(null);
        setActiveBrand(null);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveSubcategory(null);
    setActiveBrand(null);
  }, [category]);

  return (
    <AnimatePresence>
      {isOpen && category && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 w-full h-[60vh] bg-[#F4F6F8] shadow-[0_-10px_50px_rgba(0,0,0,0.2)] z-50 flex flex-col overflow-hidden rounded-t-3xl border-t border-white/20"
          >
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-100 shadow-sm z-10">
              <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                {activeSubcategory ? (
                  <button
                    onClick={() => {
                      if (activeBrand) setActiveBrand(null);
                      else setActiveSubcategory(null);
                    }}
                    className="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-[#0A1D3A]">
                    {activeBrand
                      ? activeBrand.name
                      : activeSubcategory
                      ? activeSubcategory.name
                      : category.name}
                  </h3>
                  {!activeBrand && !activeSubcategory && (
                    <p className="text-xs text-gray-500 font-medium">
                      {category.subcategories.length} Sub-Categories
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              <div className="max-w-4xl mx-auto w-full">
              <AnimatePresence mode="wait">
                {/* Step 1: Subcategories */}
                {!activeSubcategory && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => setActiveSubcategory(sub)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-transparent hover:border-[#FF6A00]/30 hover:shadow-md transition-all group"
                      >
                        <span className="font-semibold text-gray-800 group-hover:text-[#FF6A00] transition-colors">
                          {sub.name}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF6A00] transition-colors" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 2: Brands */}
                {activeSubcategory && !activeBrand && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      {activeSubcategory.brands.length} Brands
                    </p>
                    {activeSubcategory.brands.map((brand) => (
                      <div
                        key={brand.name}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#0A1D3A] text-lg flex items-center gap-2">
                            {brand.name}
                            {brand.confirmed && (
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                            )}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-[#FF6A00] bg-[#FF6A00]/10 px-2 py-1 rounded">
                            Verified
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveBrand(brand)}
                          className="w-full py-2.5 bg-[#0A1D3A] hover:bg-[#0A1D3A]/90 text-white font-semibold text-sm rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Step 3: Brand Details */}
                {activeBrand && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8 pb-10"
                  >
                    {/* Brand Image / Logo area */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-40">
                      {activeBrand.image ? (
                        <img 
                          src={activeBrand.image} 
                          alt={activeBrand.name} 
                          className="max-h-full max-w-full object-contain mix-blend-multiply" 
                        />
                      ) : (
                        <span className="text-3xl font-bold text-[#0A1D3A] opacity-50">
                          {activeBrand.name}
                        </span>
                      )}
                    </div>

                    {/* About */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">About</h4>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {activeBrand.description}
                      </p>
                    </div>

                    {/* Key Benefits */}
                    {activeBrand.keyBenefits && activeBrand.keyBenefits.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Key Benefits</h4>
                        <ul className="space-y-3">
                          {activeBrand.keyBenefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#2BA745] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 font-medium text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 space-y-3">
                      <button className="w-full py-3.5 bg-[#FF6A00] hover:bg-[#E65F00] text-white font-bold rounded-lg transition-colors shadow-lg shadow-[#FF6A00]/20">
                        Request Info
                      </button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="w-5 h-5 text-gray-500" />
                          <span className="text-[10px] font-semibold text-gray-600 text-center">Brochure</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="text-[10px] font-semibold text-gray-600 text-center">Tech Specs</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <span className="text-[10px] font-semibold text-gray-600 text-center">Dealer</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
