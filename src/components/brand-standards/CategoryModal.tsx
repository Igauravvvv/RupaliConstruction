import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Box
} from "lucide-react";
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

  // Reset internal state when category changes or modal closes
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Back Navigation
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
        <>
          {/* Combined Backdrop + Centered Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 z-50 bg-[#0A1D3A]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full sm:w-[800px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[100dvh] sm:max-h-[90vh]"
            >
            {/* Header */}
            <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-4">
                {activeSubcategory ? (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{activeProduct ? activeBrand?.name : activeBrand ? activeSubcategory.name : category.name}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A1D3A] text-lg leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        {category.subcategories.length} Sub-Categories
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {activeSubcategory && (
                <h3 className="absolute left-1/2 -translate-x-1/2 font-bold text-[#0A1D3A] hidden md:block">
                  {getHeaderTitle()}
                </h3>
              )}

              <button
                onClick={onClose}
                className="p-2 border border-gray-200 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 relative p-6 md:p-8">
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: Subcategories List */}
                  {!activeSubcategory && (
                    <motion.div
                      key="step-1"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="max-w-full space-y-4 pb-6"
                    >
                      {/* Banner */}
                      <div className="relative mb-6 mt-8">
                        {/* Floating Shield Icon */}
                        <div className="absolute -top-6 left-6 md:left-8 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 border border-blue-50 z-20">
                          <ShieldCheck className="w-7 h-7" />
                        </div>
                        
                        <div className="bg-[#f8faff] rounded-2xl p-6 md:p-8 pt-8 md:pt-10 flex items-center justify-between overflow-hidden relative border border-gray-100">
                          <div className="relative z-10 max-w-[280px] sm:max-w-sm">
                            <h2 className="text-xl md:text-[22px] font-bold text-[#0A1D3A] mb-3 leading-tight">
                              Build with Strength. Build with Trust.
                            </h2>
                            <p className="text-gray-500 text-sm">
                              Explore premium structural materials from trusted brands.
                            </p>
                          </div>
                          
                          {/* Right Graphic Pattern */}
                          <div className="absolute right-0 top-0 bottom-0 w-[55%] md:w-1/2 flex justify-end">
                             {/* The image */}
                             <div className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 100%)", maskImage: "linear-gradient(to right, transparent, black 100%)" }}>
                               <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80" alt="Construction Banner" className="w-full h-full object-cover" />
                             </div>
                             
                             {/* Decorative Shapes */}
                             <div className="absolute top-0 right-0 w-[120%] h-[200%] -translate-y-1/4 translate-x-1/4 bg-orange-100/80 rounded-full mix-blend-multiply" />
                             <div className="absolute -top-10 -right-10 w-48 h-48 border border-orange-200/60 rounded-full" />
                             <div className="absolute top-10 right-20 w-2 h-2 bg-orange-400 rounded-full opacity-50" />
                             <div className="absolute bottom-10 right-24 w-3 h-3 bg-gray-400 rounded-full opacity-50" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {category.subcategories.map((sub) => {
                          // Dynamic Icon mapping based on subcategory name
                          let SubIcon = Box;
                          let iconColorClass = "text-gray-500 bg-gray-50 border-gray-100";
                          let nameColor = "text-[#0A1D3A]";
                          
                          const lowerName = sub.name.toLowerCase();
                          if (lowerName.includes('cement')) {
                            SubIcon = Package; 
                            iconColorClass = "text-blue-500 bg-blue-50 border-blue-100";
                          } else if (lowerName.includes('steel')) {
                            SubIcon = LayoutTemplate; 
                            iconColorClass = "text-orange-500 bg-orange-50 border-orange-100";
                          } else if (lowerName.includes('brick') || lowerName.includes('block')) {
                            SubIcon = Grid; 
                            iconColorClass = "text-green-500 bg-green-50 border-green-100";
                          } else if (lowerName.includes('waterproof')) {
                            SubIcon = Droplets; 
                            iconColorClass = "text-purple-500 bg-purple-50 border-purple-100";
                          }
                          
                          return (
                            <button
                              key={sub.name}
                              onClick={() => setActiveSubcategory(sub)}
                              className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 hover:border-[#FF6A00]/30 hover:shadow-md transition-all group"
                            >
                              <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${iconColorClass}`}>
                                  <SubIcon className="w-8 h-8 stroke-[1.5]" />
                                </div>
                                <div className="text-left">
                                  <span className={`block font-bold text-xl group-hover:text-[#FF6A00] transition-colors mb-1 ${nameColor}`}>
                                    {sub.name}
                                  </span>
                                  <span className="text-sm text-gray-500 line-clamp-1">
                                    {sub.brands[0]?.description || "High quality materials for durable construction."}
                                  </span>
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6A00] shrink-0 border border-orange-100 group-hover:bg-[#FF6A00] group-hover:text-white transition-colors">
                                <ArrowRight className="w-5 h-5" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Brands List */}
                  {activeSubcategory && !activeBrand && (
                    <motion.div
                      key="step-2"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-8"
                    >
                      {/* Banner */}
                      <div className="bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between overflow-hidden relative min-h-[250px]">
                        <div className="relative z-10 md:w-1/2">
                          <h2 className="text-3xl font-bold text-[#0A1D3A] mb-2">
                            Premium {activeSubcategory.name} Brands
                          </h2>
                          <h3 className="text-xl font-semibold text-[#0A1D3A] mb-4">
                            Built for Strength & Durability
                          </h3>
                          <p className="text-gray-600 text-sm mb-6">
                            Trusted by experts. Proven in every project.
                          </p>
                        </div>
                        
                        {/* Features on banner */}
                        <div className="relative z-10 md:w-1/3 flex flex-col gap-4 bg-white/50 backdrop-blur-md p-4 rounded-xl border border-white">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded text-green-600 shadow-sm"><ShieldCheck className="w-4 h-4"/></div>
                            <div>
                              <p className="text-xs font-bold text-[#0A1D3A]">100% Original</p>
                              <p className="text-[10px] text-gray-500">Verified Brands</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded text-blue-600 shadow-sm"><CheckCircle2 className="w-4 h-4"/></div>
                            <div>
                              <p className="text-xs font-bold text-[#0A1D3A]">Expert Recommended</p>
                              <p className="text-[10px] text-gray-500">For all construction types</p>
                            </div>
                          </div>
                        </div>

                        {/* Background graphic */}
                        <div className="absolute right-0 bottom-0 md:-right-20 md:-bottom-20 opacity-20 pointer-events-none">
                          <category.icon className="w-64 h-64 text-[#0A1D3A]" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#0A1D3A] text-lg">
                          {activeSubcategory.brands.length} Brands Available
                        </h4>
                      </div>

                      {/* Brands Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {activeSubcategory.brands.map((brand) => (
                          <div
                            key={brand.name}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow group cursor-pointer"
                            onClick={() => setActiveBrand(brand)}
                          >
                            <div className="h-40 bg-gray-50 rounded-xl mb-6 p-4 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-100 transition-colors">
                              <img 
                                src={brand.image || "https://images.unsplash.com/photo-1541888087425-ce81dfc46928?w=200&q=80"} 
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 flex flex-col">
                              <h5 className="font-bold text-[#0A1D3A] text-lg mb-2">{brand.name}</h5>
                              {brand.confirmed && (
                                <div className="flex items-center gap-1.5 mb-3">
                                  <ShieldCheck className="w-4 h-4 text-green-600" />
                                  <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">
                                    Verified
                                  </span>
                                </div>
                              )}
                              <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
                                {brand.description}
                              </p>
                              <button
                                className="w-full py-3 bg-[#0A1D3A] group-hover:bg-[#FF6A00] text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                              >
                                View Details <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Brand Details & Products List */}
                  {activeBrand && !activeProduct && (
                    <motion.div
                      key="step-3"
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-8"
                    >
                      {/* Brand Info Split Layout */}
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Big Image */}
                        <div className="lg:w-1/3 bg-[#F9F7F1] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                           <img 
                              src={activeBrand.image || "https://images.unsplash.com/photo-1541888087425-ce81dfc46928?w=400&q=80"} 
                              alt={activeBrand.name}
                              className="max-w-full max-h-[250px] object-contain drop-shadow-xl"
                            />
                        </div>
                        
                        {/* Right: Details */}
                        <div className="lg:w-2/3 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold text-[#0A1D3A]">{activeBrand.name}</h2>
                            {activeBrand.confirmed && (
                                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 border border-green-200">
                                  <ShieldCheck className="w-4 h-4" />
                                  <span className="text-[10px] uppercase font-bold tracking-wider">
                                    Verified
                                  </span>
                                </div>
                            )}
                          </div>
                          <p className="text-gray-500 italic mb-6">The Engineer's Choice</p>
                          <p className="text-gray-700 leading-relaxed mb-8 max-w-2xl">
                            {activeBrand.description}
                          </p>

                          {activeBrand.keyBenefits && (
                            <div className="flex flex-wrap gap-6 mb-8">
                              {activeBrand.keyBenefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                  <CheckCircle2 className="w-5 h-5 text-gray-400" />
                                  {benefit}
                                </div>
                              ))}
                            </div>
                          )}

                          <button className="bg-[#0A1D3A] hover:bg-[#0A1D3A]/90 text-white font-semibold py-3 px-8 rounded-xl transition-colors w-max flex items-center gap-2">
                            Download Brochure <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Products List */}
                      {activeBrand.products && activeBrand.products.length > 0 && (
                        <div className="pt-8 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-[#0A1D3A] text-xl">
                              Products ({activeBrand.products.length})
                            </h3>
                            <button className="text-sm font-semibold text-gray-500 hover:text-[#FF6A00] flex items-center gap-1 transition-colors">
                              View All <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {activeBrand.products.map((product) => (
                              <div key={product.name} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                                <div className="bg-[#F8F9FA] rounded-xl p-6 h-48 flex items-center justify-center mb-4 group-hover:bg-[#F1F3F5] transition-colors relative">
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform mix-blend-multiply"
                                  />
                                </div>
                                <h5 className="font-bold text-[#0A1D3A] text-sm mb-1 leading-snug line-clamp-2 min-h-[40px]">
                                  {product.name}
                                </h5>
                                <p className="text-xs text-gray-500 mb-4">{product.grade || "Premium Grade"}</p>
                                <div className="mt-auto">
                                  <button 
                                    onClick={() => setActiveProduct(product)}
                                    className="w-full py-2 bg-gray-100 group-hover:bg-[#FF6A00] group-hover:text-white text-[#0A1D3A] font-semibold text-xs rounded-lg transition-colors"
                                  >
                                    View Product
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
                      className="flex flex-col lg:flex-row gap-10"
                    >
                      {/* Left: Images */}
                      <div className="lg:w-2/5 space-y-4">
                        <div className="bg-[#F9F7F1] rounded-3xl p-10 flex items-center justify-center h-[400px]">
                           <img 
                              src={activeProduct.image} 
                              alt={activeProduct.name}
                              className="max-w-full max-h-full object-contain drop-shadow-2xl mix-blend-multiply"
                            />
                        </div>
                        {/* Thumbnails (Mocked) */}
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl border-2 border-[#FF6A00] p-2 flex items-center justify-center bg-white cursor-pointer">
                            <img src={activeProduct.image} alt="Thumb 1" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="w-16 h-16 rounded-xl border border-gray-200 p-2 flex items-center justify-center bg-white opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                            <img src={activeProduct.image} alt="Thumb 2" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="w-16 h-16 rounded-xl border border-gray-200 p-2 flex items-center justify-center bg-white opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                            <img src={activeProduct.image} alt="Thumb 3" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                            +2
                          </div>
                        </div>
                      </div>

                      {/* Right: Info */}
                      <div className="lg:w-3/5 flex flex-col justify-center py-4">
                        <h2 className="text-3xl font-bold text-[#0A1D3A] mb-4">{activeProduct.name}</h2>
                        
                        <div className="mb-8">
                          <h4 className="font-bold text-[#0A1D3A] mb-2 text-lg">Product Highlights</h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {activeProduct.description || "Premium quality product designed for exceptional performance and durability in modern construction."}
                          </p>
                          
                          <ul className="space-y-3">
                            {activeProduct.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#2BA745] flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Grade</p>
                            <p className="font-bold text-[#0A1D3A] text-sm">{activeProduct.grade || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Type</p>
                            <p className="font-bold text-[#0A1D3A] text-sm">{activeProduct.type || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Standard</p>
                            <p className="font-bold text-[#0A1D3A] text-sm">{activeProduct.standard || "-"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold">Strength</p>
                            <p className="font-bold text-[#0A1D3A] text-sm">{activeProduct.strength || "-"}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                          <button className="flex-1 py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-[#0A1D3A] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                            Technical Data Sheet <FileText className="w-4 h-4" />
                          </button>
                          <button className="flex-1 py-4 px-6 bg-[#0A1D3A] hover:bg-[#0A1D3A]/90 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0A1D3A]/20">
                            Request for Quote <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
