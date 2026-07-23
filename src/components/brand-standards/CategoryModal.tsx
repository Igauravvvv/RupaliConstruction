import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";
import { 
  X, 
  ArrowLeft, 
  ChevronRight, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  FileText,
  Package,
  LayoutTemplate,
  Grid,
  Droplets,
  Box,
  Info,
  Lightbulb,
  MapPin,
  Globe,
  Calendar,
  CheckSquare,
  Star,
  Zap,
  Hammer
} from "lucide-react";
import { brandDomains } from "@/data/brandStandardsData";
import type { Category, SubCategory, Brand, Product } from "@/data/brandStandardsData";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  const [activeSubcategory, setActiveSubcategory] = useState<SubCategory | null>(null);
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveSubcategory(null);
        setActiveBrand(null);
        setActiveProduct(null);
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveSubcategory(null);
    setActiveBrand(null);
    setActiveProduct(null);
  }, [category]);

  const handleBack = () => {
    if (activeProduct) {
      setActiveProduct(null);
    } else if (activeBrand) {
      setActiveBrand(null);
    } else if (activeSubcategory) {
      setActiveSubcategory(null);
    }
  };

  const getHeaderTitle = () => {
    if (activeProduct) return activeProduct.name;
    if (activeBrand) return activeBrand.name;
    if (activeSubcategory) return activeSubcategory.name;
    return category?.name || "";
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <RemoveScroll>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 bg-[#0A1D3A]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onWheel={(e) => e.stopPropagation()}
              className="w-full sm:w-[900px] bg-[#F8FAFC] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[100dvh] sm:max-h-[90vh]"
            >
            {/* Header */}
            <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-4">
                {activeSubcategory ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#0A1D3A] transition-colors font-medium"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: category.color }}
                    >
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A1D3A] text-lg leading-tight">
                        {category.name} Standards
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {category.subcategories.length} Material Categories
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {activeSubcategory && (
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2">
                  <h3 className="font-bold text-[#0A1D3A] text-lg">
                    {getHeaderTitle()}
                  </h3>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-2 border border-gray-200 text-gray-400 hover:text-[#0A1D3A] rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 relative p-6 md:p-8">
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Material Categories List */}
                  {!activeSubcategory && (
                    <motion.div
                      key="step-1"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-6"
                    >
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-[#0A1D3A] mb-2">Select a Material Category</h2>
                        <p className="text-gray-500">Explore our curated selection of premium materials and verified brands.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.subcategories.map((sub) => {
                          return (
                            <button
                              key={sub.name}
                              onClick={() => setActiveSubcategory(sub)}
                              className="group flex flex-col p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all text-left"
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                                  {sub.image ? (
                                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                  ) : (
                                    <Box className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-xl text-[#0A1D3A] mb-1 group-hover:text-[#FF6A00] transition-colors">{sub.name}</h3>
                                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                    {sub.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                  <ShieldCheck className="w-4 h-4 text-[#FF6A00]" />
                                  <span>{sub.brands.length} Approved Brands</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-bold text-[#FF6A00]">
                                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Material Detail Page */}
                  {activeSubcategory && !activeBrand && (
                    <motion.div
                      key="step-2"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-10 pb-10"
                    >
                      {/* Hero Section */}
                      <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                          <h2 className="text-4xl font-bold text-[#0A1D3A] mb-4">{activeSubcategory.name}</h2>
                          <p className="text-lg text-gray-600 mb-8">{activeSubcategory.description}</p>
                          
                          {activeSubcategory.benefits && (
                            <div className="flex flex-col gap-3">
                              {activeSubcategory.benefits.slice(0, 3).map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="font-semibold text-[#0A1D3A]">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="md:w-1/2 h-64 md:h-auto relative">
                          {activeSubcategory.image ? (
                            <img src={activeSubcategory.image} alt={activeSubcategory.name} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center"><Box className="w-16 h-16 text-gray-300" /></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent md:block hidden" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent md:hidden block" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Educational Content */}
                        <div className="lg:col-span-2 space-y-10">
                          
                          {/* About */}
                          {activeSubcategory.whatIsIt && (
                            <section>
                              <h3 className="text-xl font-bold text-[#0A1D3A] mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-[#FF6A00]" /> What is {activeSubcategory.name}?
                              </h3>
                              <p className="text-gray-600 leading-relaxed text-lg bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                {activeSubcategory.whatIsIt}
                              </p>
                            </section>
                          )}

                          {/* Why We Use It */}
                          {activeSubcategory.whyWeUseIt && (
                            <section>
                              <h3 className="text-xl font-bold text-[#0A1D3A] mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-[#FF6A00]" /> Why We Use It
                              </h3>
                              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <ul className="space-y-4">
                                  {activeSubcategory.whyWeUseIt.map((reason, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                      <span className="text-gray-700">{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </section>
                          )}

                          {/* Where Is It Used */}
                          {activeSubcategory.whereUsed && (
                            <section>
                              <h3 className="text-xl font-bold text-[#0A1D3A] mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#FF6A00]" /> Where Is It Used?
                              </h3>
                              <div className="flex flex-wrap gap-3">
                                {activeSubcategory.whereUsed.map((place, idx) => (
                                  <span key={idx} className="bg-white border border-gray-200 text-[#0A1D3A] px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2">
                                    <Box className="w-4 h-4 text-gray-400" /> {place}
                                  </span>
                                ))}
                              </div>
                            </section>
                          )}
                          
                          {/* Educational Callouts */}
                          {(activeSubcategory.didYouKnow || activeSubcategory.constructionTip) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {activeSubcategory.didYouKnow && (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl">
                                  <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-4 h-4" /> Did You Know?
                                  </h4>
                                  <p className="text-blue-800 text-sm leading-relaxed">{activeSubcategory.didYouKnow}</p>
                                </div>
                              )}
                              {activeSubcategory.constructionTip && (
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
                                  <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                                    <Hammer className="w-4 h-4" /> Construction Tip
                                  </h4>
                                  <p className="text-amber-800 text-sm leading-relaxed">{activeSubcategory.constructionTip}</p>
                                </div>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Right Column: Sidebar */}
                        <div className="space-y-8">
                          {/* Quality Checks */}
                          {activeSubcategory.qualityChecks && (
                            <div className="bg-[#0A1D3A] rounded-2xl p-6 shadow-lg text-white">
                              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-[#FF6A00]" /> Quality Standards
                              </h3>
                              <p className="text-blue-200 text-sm mb-4">Before approving any material, we verify:</p>
                              <ul className="space-y-3">
                                {activeSubcategory.qualityChecks.map((check, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <ShieldCheck className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                                    <span>{check}</span>
                                  </li>
                                ))}
                              </ul>
                              {activeSubcategory.qualityStandard && (
                                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-blue-200 italic">
                                  Complies with: {activeSubcategory.qualityStandard}
                                </div>
                              )}
                            </div>
                          )}

                          {/* All Benefits */}
                          {activeSubcategory.benefits && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                              <h3 className="text-lg font-bold text-[#0A1D3A] mb-4">Key Benefits</h3>
                              <div className="flex flex-wrap gap-2">
                                {activeSubcategory.benefits.map((benefit, idx) => (
                                  <span key={idx} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-100">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Brands Section */}
                      <div className="pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-2xl font-bold text-[#0A1D3A]">Approved Brands</h3>
                            <p className="text-gray-500">Industry-leading manufacturers we trust.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {activeSubcategory.brands.map((brand) => (
                            <div
                              key={brand.name}
                              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow group cursor-pointer"
                              onClick={() => setActiveBrand(brand)}
                            >
                              <div className="h-32 bg-gray-50 rounded-xl mb-6 p-4 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                                {(() => {
                                  const logoSrc = brand.image || (brandDomains[brand.name] ? `https://logo.clearbit.com/${brandDomains[brand.name]}?size=400` : `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=0A1D3A&color=fff&size=200&font-size=0.3`);
                                  return (
                                    <img 
                                      src={logoSrc} 
                                      alt={brand.name}
                                      className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-105 transition-transform"
                                      onError={(e) => {
                                        const img = e.currentTarget;
                                        if (img.src.includes('clearbit')) {
                                          img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=0A1D3A&color=fff&size=200&font-size=0.3`;
                                        }
                                      }}
                                    />
                                  );
                                })()}
                              </div>
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-bold text-[#0A1D3A] text-xl">{brand.name}</h5>
                                  {brand.confirmed && (
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                                  {brand.description}
                                </p>
                                <button className="w-full py-3 bg-gray-50 group-hover:bg-[#0A1D3A] text-[#0A1D3A] group-hover:text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                                  View Brand Profile <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Brand Details */}
                  {activeBrand && !activeProduct && (
                    <motion.div
                      key="step-3"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-10 pb-10"
                    >
                      {/* Brand Hero */}
                      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                          <Globe className="w-64 h-64" />
                        </div>
                        
                        <div className="w-full md:w-1/3 h-48 bg-gray-50 rounded-2xl p-8 flex items-center justify-center shrink-0 border border-gray-100 relative z-10">
                           {(() => {
                             const logoSrc = activeBrand.image || (brandDomains[activeBrand.name] ? `https://logo.clearbit.com/${brandDomains[activeBrand.name]}?size=400` : `https://ui-avatars.com/api/?name=${encodeURIComponent(activeBrand.name)}&background=0A1D3A&color=fff&size=200&font-size=0.3`);
                             return (
                               <img 
                                  src={logoSrc} 
                                  alt={activeBrand.name}
                                  className="max-w-full max-h-full object-contain drop-shadow-md mix-blend-multiply"
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    if (img.src.includes('clearbit')) {
                                      img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeBrand.name)}&background=0A1D3A&color=fff&size=200&font-size=0.3`;
                                    }
                                  }}
                                />
                             );
                           })()}
                        </div>
                        
                        <div className="w-full md:w-2/3 relative z-10">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h2 className="text-4xl font-bold text-[#0A1D3A]">{activeBrand.name}</h2>
                            {activeBrand.confirmed && (
                                <span className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full text-green-700 border border-green-200 text-xs font-bold uppercase tracking-wider">
                                  <ShieldCheck className="w-4 h-4" /> Verified Brand
                                </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mb-6">
                            {activeBrand.country && (
                              <div className="flex items-center gap-2 text-gray-600 font-medium">
                                <Globe className="w-4 h-4 text-gray-400" /> Origin: {activeBrand.country}
                              </div>
                            )}
                            {activeBrand.yearsInBusiness && (
                              <div className="flex items-center gap-2 text-gray-600 font-medium">
                                <Calendar className="w-4 h-4 text-gray-400" /> {activeBrand.yearsInBusiness}+ Years in Business
                              </div>
                            )}
                          </div>

                          <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            {activeBrand.description}
                          </p>

                          <div className="flex gap-4">
                            {activeBrand.website && (
                              <a href={activeBrand.website} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#0A1D3A] font-bold rounded-xl transition-colors flex items-center gap-2 text-sm">
                                <Globe className="w-4 h-4" /> Official Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Why We Choose */}
                        {activeBrand.whyWeChose && (
                          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-[#0A1D3A] mb-6 flex items-center gap-2">
                              <Star className="w-5 h-5 text-[#FF6A00]" /> Why We Choose {activeBrand.name}
                            </h3>
                            <ul className="space-y-4">
                              {activeBrand.whyWeChose.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-[#2BA745] shrink-0 mt-0.5" />
                                  <span className="text-gray-700 font-medium">{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Certifications & Benefits */}
                        <div className="space-y-8">
                          {activeBrand.certifications && (
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                              <h3 className="text-xl font-bold text-[#0A1D3A] mb-4">Quality Certifications</h3>
                              <div className="flex flex-wrap gap-2">
                                {activeBrand.certifications.map((cert, idx) => (
                                  <span key={idx} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold border border-blue-100 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" /> {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeBrand.keyBenefits && (
                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                              <h3 className="text-xl font-bold text-[#0A1D3A] mb-4">Brand Highlights</h3>
                              <div className="flex flex-wrap gap-2">
                                {activeBrand.keyBenefits.map((benefit, idx) => (
                                  <span key={idx} className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200">
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Products List */}
                      {activeBrand.products && activeBrand.products.length > 0 && (
                        <div className="pt-8">
                          <h3 className="text-2xl font-bold text-[#0A1D3A] mb-8">Popular Products</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeBrand.products.map((product) => (
                              <div key={product.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full cursor-pointer" onClick={() => setActiveProduct(product)}>
                                <div className="bg-gray-50 rounded-xl p-6 h-48 flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors relative">
                                  {product.image ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name}
                                      className="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                                    />
                                  ) : (
                                    <Box className="w-12 h-12 text-gray-300" />
                                  )}
                                </div>
                                <h5 className="font-bold text-[#0A1D3A] text-lg mb-2 leading-snug">
                                  {product.name}
                                </h5>
                                <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">{product.description}</p>
                                <div className="mt-auto">
                                  <button className="w-full py-3 bg-gray-50 group-hover:bg-[#FF6A00] group-hover:text-white text-[#0A1D3A] font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                                    View Specifications <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 4: Product Details */}
                  {activeProduct && (
                    <motion.div
                      key="step-4"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="pb-10"
                    >
                      <div className="flex flex-col lg:flex-row gap-10">
                        {/* Left: Images */}
                        <div className="lg:w-2/5 space-y-4">
                          <div className="bg-white border border-gray-100 rounded-3xl p-10 flex items-center justify-center h-[400px] shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white z-0" />
                            {activeProduct.image ? (
                              <img 
                                src={activeProduct.image} 
                                alt={activeProduct.name}
                                className="max-w-full max-h-full object-contain drop-shadow-2xl mix-blend-multiply relative z-10"
                              />
                            ) : (
                              <Box className="w-20 h-20 text-gray-200 relative z-10" />
                            )}
                          </div>
                        </div>

                        {/* Right: Info */}
                        <div className="lg:w-3/5 flex flex-col">
                          <h2 className="text-3xl font-bold text-[#0A1D3A] mb-4">{activeProduct.name}</h2>
                          
                          <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {activeProduct.description}
                          </p>
                          
                          {/* Top Specs Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {activeProduct.grade && (
                              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Grade</p>
                                <p className="font-bold text-[#0A1D3A]">{activeProduct.grade}</p>
                              </div>
                            )}
                            {activeProduct.type && (
                              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Type</p>
                                <p className="font-bold text-[#0A1D3A]">{activeProduct.type}</p>
                              </div>
                            )}
                            {activeProduct.standard && (
                              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Standard</p>
                                <p className="font-bold text-[#0A1D3A]">{activeProduct.standard}</p>
                              </div>
                            )}
                            {activeProduct.strength && (
                              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Strength</p>
                                <p className="font-bold text-[#0A1D3A]">{activeProduct.strength}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-10">
                            {/* Features */}
                            {activeProduct.features && activeProduct.features.length > 0 && (
                              <div>
                                <h4 className="text-xl font-bold text-[#0A1D3A] mb-4">Key Features</h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {activeProduct.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                      <CheckCircle2 className="w-5 h-5 text-[#2BA745] shrink-0" />
                                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Tech Specs */}
                            {activeProduct.technicalSpecs && (
                              <div>
                                <h4 className="text-xl font-bold text-[#0A1D3A] mb-4">Technical Specifications</h4>
                                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                  {Object.entries(activeProduct.technicalSpecs).map(([key, value], idx) => (
                                    <div key={key} className={`flex justify-between p-4 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-100 last:border-0`}>
                                      <span className="text-gray-600 font-medium">{key}</span>
                                      <span className="font-bold text-[#0A1D3A]">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Applications */}
                            {activeProduct.applications && (
                              <div>
                                <h4 className="text-xl font-bold text-[#0A1D3A] mb-4">Applications</h4>
                                <div className="flex flex-wrap gap-3">
                                  {activeProduct.applications.map((app, idx) => (
                                    <span key={idx} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                                      {app}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {activeProduct.expectedLifespan && (
                                <div className="bg-blue-50 p-6 rounded-2xl">
                                  <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Expected Lifespan</h5>
                                  <p className="text-blue-800 text-sm">{activeProduct.expectedLifespan}</p>
                                </div>
                              )}
                              {activeProduct.warranty && (
                                <div className="bg-green-50 p-6 rounded-2xl">
                                  <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Warranty</h5>
                                  <p className="text-green-800 text-sm">{activeProduct.warranty}</p>
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </RemoveScroll>
      )}
    </AnimatePresence>
  );
}
