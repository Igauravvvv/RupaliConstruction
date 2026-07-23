import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { categories, Category, brandDomains } from "@/data/brandStandardsData";
import CategoryModal from "@/components/brand-standards/CategoryModal";
import ContactModal from "@/components/brand-standards/ContactModal";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  ArrowRight,
  MessageSquare,
  BadgeCheck,
  Clock,
  Truck
} from "lucide-react";

export default function BrandStandards() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Extract all unique brand names from categories
  const allBrands = Array.from(new Set(
    categories.flatMap(c => c.subcategories.flatMap(s => s.brands.map(b => b.name)))
  )).filter(name => !name.includes("Local") && !name.includes("Custom"));
  
  const displayedBrands = showAllBrands ? allBrands : allBrands.slice(0, 14);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* ─── UNIFIED HERO & CATEGORY SECTION ─── */}
      <section className="relative min-h-[90vh] bg-white pt-32 pb-24 overflow-hidden">
        {/* Background Image with Premium Gradient Fade */}
        <div className="absolute top-0 left-0 w-full h-[70%] z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80" 
            alt="Modern Construction"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-[#F8FAFC]" />
        </div>

        <div className="container-rc relative z-10">
          
          {/* Top Content */}
          <div className="max-w-3xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[#FF6A00] font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[#FF6A00]"></span> Material Knowledge Center
              </p>
              <h1 className="text-4xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6 text-[#0A1D3A] tracking-tight">
                Discover Our Curated <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A1D3A] to-[#FF6A00]">Construction Standards</span>
              </h1>
              <p className="text-gray-600 text-lg sm:text-xl mb-10 max-w-2xl font-light leading-relaxed">
                Explore the materials, brands, and standards that make our projects stand the test of time. A complete educational guide to premium construction.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 flex-1 min-w-[220px] hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl border border-orange-100 flex items-center justify-center bg-orange-50 shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#FF6A00]" />
                  </div>
                  <div>
                    <p className="font-bold text-base text-[#0A1D3A]">Verified Quality</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Strict multi-point checks</p>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 flex-1 min-w-[220px] hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl border border-blue-100 flex items-center justify-center bg-blue-50 shrink-0">
                    <BadgeCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-base text-[#0A1D3A]">Expert Approved</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Recommended by engineers</p>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 flex-1 min-w-[220px] hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl border border-green-100 flex items-center justify-center bg-green-50 shrink-0">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-base text-[#0A1D3A]">Trusted Brands</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Industry leading partners</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => {
              const borderColor = category.name === 'Structural' ? 'border-[#0A1D3A]' : 
                                  category.name === 'MEP' ? 'border-[#FF6A00]' : 
                                  category.name === 'Interior' ? 'border-[#2BA745]' : 'border-[#6C5CE7]';
              
              const hoverColor = category.name === 'Structural' ? 'group-hover:text-[#0A1D3A]' : 
                                 category.name === 'MEP' ? 'group-hover:text-[#FF6A00]' : 
                                 category.name === 'Interior' ? 'group-hover:text-[#2BA745]' : 'group-hover:text-[#6C5CE7]';
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                  className="h-full"
                >
                  <div 
                    className={`group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 flex flex-col cursor-pointer h-full border-b-[6px] ${borderColor} transition-all duration-500 hover:-translate-y-2`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {/* Top Image */}
                    <div className="h-56 relative overflow-hidden shrink-0 bg-gray-100">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541888087425-ce81dfc46928?w=600&q=80";
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-5 left-5 right-5 flex flex-wrap gap-2">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">
                          {category.materialCount || category.subcategories.length} Materials
                        </span>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest shadow-sm">
                          {category.brandCount || 0} Brands
                        </span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{category.name}</h3>
                        {category.tagline && (
                          <p className="text-white/80 text-sm font-medium drop-shadow-sm">{category.tagline}</p>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 pt-6 flex-1 flex flex-col bg-white relative z-0">
                      <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1 font-medium">
                        {category.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                        <span className={`font-bold text-sm tracking-wide uppercase transition-colors duration-300 text-gray-400 ${hoverColor}`}>
                          Explore Category
                        </span>
                        <button className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-300 group-hover:bg-gray-50 ${hoverColor} group-hover:border-transparent group-hover:shadow-md`}>
                          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Stats Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 mx-auto w-max bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 py-4 px-8 flex items-center gap-6 relative z-10"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6A00] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-[#0A1D3A] text-sm whitespace-nowrap hidden sm:block">Building Trust</span>
            </div>
            
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            
            <span className="text-sm whitespace-nowrap"><span className="font-bold text-[#FF6A00] text-base">30+</span> <span className="text-gray-500 font-medium">Materials</span></span>
            
            <div className="w-px h-6 bg-gray-200"></div>
            
            <span className="text-sm whitespace-nowrap"><span className="font-bold text-[#FF6A00] text-base">50+</span> <span className="text-gray-500 font-medium">Brands</span></span>
            
            <div className="w-px h-6 bg-gray-200"></div>
            
            <span className="text-sm whitespace-nowrap"><span className="font-bold text-[#FF6A00] text-base">100%</span> <span className="text-gray-500 font-medium">Verified</span></span>
          </motion.div>
        </div>
      </section>

      {/* ─── 3. PARTNER LOGOS GRID ─── */}
      <section className="py-24 bg-[#0A1D3A] dark-nav-trigger relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FF6A00]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="container-rc relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <p className="text-[#FF6A00] font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[#FF6A00]"></span> Our Verified Network
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Partnering with the Best
              </h2>
              <p className="text-blue-100 text-lg font-light leading-relaxed">
                Every brand is carefully selected and verified to meet our strict quality, durability, and performance standards.
              </p>
            </div>
            <button 
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="text-white border border-white/20 hover:bg-white/10 px-8 py-4 rounded-full text-sm font-bold tracking-wider transition-colors flex items-center gap-3 shrink-0"
            >
              {showAllBrands ? "SHOW LESS BRANDS" : "VIEW ALL BRANDS"} <ArrowRight className={`w-4 h-4 transition-transform ${showAllBrands ? "-rotate-90" : ""}`} />
            </button>
          </div>

          {showAllBrands ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {allBrands.map((brand, index) => (
                <div 
                  key={`${brand}-${index}`} 
                  className="bg-white rounded-2xl h-40 flex flex-col items-center justify-center p-6 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-[#FF6A00]/30 relative group hover:-translate-y-1"
                >
                  <div className="h-20 w-full flex items-center justify-center mb-3">
                    <img 
                      src={brandDomains[brand] ? `https://logo.clearbit.com/${brandDomains[brand]}?size=400` : `https://ui-avatars.com/api/?name=${encodeURIComponent(brand)}&background=0A1D3A&color=fff&size=200&font-size=0.3`} 
                      alt={brand}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.includes('clearbit')) {
                          img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand)}&background=0A1D3A&color=fff&size=200&font-size=0.3`;
                        } else {
                          img.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                  <span className="font-bold text-[#0A1D3A] text-center text-sm opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden relative -mx-4 px-4 md:mx-0 md:px-0 py-6">
              {/* Gradient Mask for fading edges */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A1D3A] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A1D3A] to-transparent z-10 pointer-events-none"></div>
              
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: displayedBrands.length * 4 }}
                className="flex gap-6 w-max"
              >
                {[...displayedBrands, ...displayedBrands].map((brand, index) => (
                  <div 
                    key={`${brand}-${index}`} 
                    className="w-56 shrink-0 bg-white rounded-2xl h-40 flex flex-col items-center justify-center p-6 hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-[#FF6A00]/30 relative group hover:-translate-y-1"
                  >
                    <div className="h-20 w-full flex items-center justify-center mb-3">
                      <img 
                        src={brandDomains[brand] ? `https://logo.clearbit.com/${brandDomains[brand]}?size=400` : `https://ui-avatars.com/api/?name=${encodeURIComponent(brand)}&background=0A1D3A&color=fff&size=200&font-size=0.3`} 
                        alt={brand}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src.includes('clearbit')) {
                            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand)}&background=0A1D3A&color=fff&size=200&font-size=0.3`;
                          }
                        }}
                      />
                    </div>
                    <span className="font-bold text-[#0A1D3A] text-center text-sm opacity-80 group-hover:opacity-100 transition-opacity mt-auto">
                      {brand}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. CTA SECTION ─── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container-rc relative z-10">
          <div className="bg-gradient-to-br from-[#051124] to-[#0A1D3A] rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row relative shadow-2xl">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Left: Mascot Image */}
            <div className="lg:w-2/5 relative h-[350px] lg:h-auto bg-white flex items-end justify-center z-10">
              <div className="absolute inset-y-0 -right-12 w-24 bg-white skew-x-[-15deg] hidden lg:block z-0 origin-bottom" />
              <img 
                src="/assets/brand-standards/mascot.png" 
                alt="Expert Guide" 
                className="h-[95%] lg:h-[90%] w-auto object-contain relative z-10 mix-blend-multiply"
              />
            </div>

            {/* Right: Content */}
            <div className="lg:w-3/5 p-10 md:p-16 lg:p-20 flex flex-col justify-center relative z-10">
              
              <div className="space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-[#FF6A00]/20 text-[#FF6A00] px-4 py-2 rounded-full text-sm font-bold border border-[#FF6A00]/20">
                  <MessageSquare className="w-4 h-4" /> Expert Consultation
                </div>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] tracking-tight">
                  Need help selecting the right <br className="hidden xl:block"/> materials for your project?
                </h2>
                
                <p className="text-blue-100 text-lg md:text-xl font-light max-w-xl mx-auto lg:mx-0">
                  Our structural engineers and material experts are here to guide you through our approved standards.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <ContactModal defaultService="Brand Material Request">
                    <button className="w-full sm:w-auto bg-[#FF6A00] hover:bg-[#E65F00] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(255,106,0,0.3)] hover:shadow-[0_12px_25px_rgba(255,106,0,0.4)] hover:-translate-y-1">
                      REQUEST MATERIAL INFO <ArrowRight className="w-5 h-5" />
                    </button>
                  </ContactModal>
                  
                  <ContactModal defaultService="Brand Standards Consultation">
                    <button className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-white hover:bg-white hover:text-[#0A1D3A] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-3">
                      TALK TO AN EXPERT
                    </button>
                  </ContactModal>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ─── Category Modal ─── */}
      <CategoryModal 
        isOpen={!!activeCategory} 
        onClose={() => setActiveCategory(null)} 
        category={activeCategory} 
      />
    </div>
  );
}
