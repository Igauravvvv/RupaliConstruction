import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { categories, Category } from "@/data/brandStandardsData";
import CategoryModal from "@/components/brand-standards/CategoryModal";
import ContactModal from "@/components/brand-standards/ContactModal";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  LayoutGrid, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  BadgeCheck,
  Clock,
  Truck
} from "lucide-react";

export default function BrandStandards() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ─── UNIFIED HERO & CATEGORY SECTION ─── */}
      <section className="relative min-h-[90vh] bg-[#F4F6F8] pt-32 pb-24 overflow-hidden dark-nav-trigger">
        {/* Background Image with Gradient Fade */}
        <div className="absolute top-0 left-0 w-full h-[65%] z-0">
          <img 
            src="https://images.unsplash.com/photo-1541888087425-ce81dfc46928?auto=format&fit=crop&w=1920&q=80" 
            alt="Construction Site"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F4F6F8]/20 via-[#F4F6F8]/60 to-[#F4F6F8]" />
        </div>

        <div className="container-rc relative z-10">
          
          {/* Top Content */}
          <div className="max-w-2xl mb-16">
            <p className="text-[#FF6A00] font-bold text-sm tracking-widest uppercase mb-4">
              Explore By Category
            </p>
            <h1 className="text-4xl lg:text-[2.8rem] font-bold leading-[1.1] mb-6 text-[#0A1D3A]">
              Choose a Category to Explore <br />
              <span className="text-[#FF6A00]">Our Trusted Brands</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Handpicked brands. Premium quality. Built for every step of your construction journey.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-gray-100 flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center bg-orange-50 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#FF6A00]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0A1D3A]">100% Authentic</p>
                  <p className="text-[10px] text-gray-500">Genuine & Verified Brands</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-gray-100 flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center bg-orange-50 shrink-0">
                  <BadgeCheck className="w-5 h-5 text-[#FF6A00]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0A1D3A]">Expert Approved</p>
                  <p className="text-[10px] text-gray-500">Recommended by Experts</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-gray-100 flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center bg-orange-50 shrink-0">
                  <Truck className="w-5 h-5 text-[#FF6A00]" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0A1D3A]">Nationwide Delivery</p>
                  <p className="text-[10px] text-gray-500">Fast & Reliable Service</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const borderColor = category.name === 'Structural' ? 'border-[#0A1D3A]' : 
                                  category.name === 'MEP' ? 'border-[#FF6A00]' : 
                                  category.name === 'Interior' ? 'border-[#16a34a]' : 'border-[#9333ea]';
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ delay: index * 0.15 }}
                  className="h-full"
                >
                  <div 
                    className={`bg-white rounded-3xl overflow-visible shadow-lg border border-gray-100 flex flex-col cursor-pointer h-full border-b-[6px] ${borderColor} hover:-translate-y-2 transition-transform duration-300`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {/* Top Image */}
                    <div className="h-48 relative overflow-visible shrink-0 rounded-t-3xl">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover rounded-t-3xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541888087425-ce81dfc46928?w=600&q=80";
                        }}
                      />
                      
                      {/* Floating Circle Icon */}
                      <div 
                        className="absolute -bottom-7 left-6 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white shadow-md z-10"
                        style={{ backgroundColor: category.color }}
                      >
                        <category.icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-12 pb-6 px-6 flex-1 flex flex-col bg-white rounded-b-3xl relative z-0">
                      <h3 className="text-2xl font-bold text-[#0A1D3A] mb-1">{category.name}</h3>
                      <p className="text-xs font-bold text-[#FF6A00] mb-4 uppercase tracking-wide">{category.subcategories.length} Sub-Categories</p>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                        {category.description}
                      </p>
                      
                      <div className="mt-auto flex justify-end">
                        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0A1D3A] hover:border-[#0A1D3A] transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Stats Pill */}
          <div className="mt-16 mx-auto max-w-4xl bg-white rounded-full shadow-lg border border-gray-100 p-4 px-8 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-6 md:gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6A00]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-[#0A1D3A] text-sm whitespace-nowrap">Building Trust, Constructing Futures</span>
            </div>
            
            <div className="hidden md:block w-px h-6 bg-gray-200"></div>
            
            <div className="flex items-center gap-4 text-xs md:text-sm whitespace-nowrap">
              <span className="font-bold text-[#FF6A00]">500+ <span className="text-gray-500 font-medium">Trusted Brands</span></span>
            </div>
            
            <div className="hidden md:block w-px h-6 bg-gray-200"></div>
            
            <div className="flex items-center gap-4 text-xs md:text-sm whitespace-nowrap">
              <span className="font-bold text-[#FF6A00]">10,000+ <span className="text-gray-500 font-medium">Quality Products</span></span>
            </div>
            
            <div className="hidden md:block w-px h-6 bg-gray-200"></div>
            
            <div className="flex items-center gap-4 text-xs md:text-sm whitespace-nowrap">
              <span className="font-bold text-[#FF6A00]">50,000+ <span className="text-gray-500 font-medium">Happy Customers</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. PARTNER LOGOS GRID ─── */}
      <section className="py-20 bg-[#0A1D3A] dark-nav-trigger">
        <div className="container-rc">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[#FF6A00] font-bold text-sm tracking-widest uppercase mb-2">
                Our Verified Brands
              </p>
              <h2 className="text-3xl font-bold text-white">
                Partnering with the Best
              </h2>
            </div>
            <button className="text-white border border-white/20 hover:bg-white/10 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
              VIEW ALL BRANDS <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              "UltraTech", "Ambuja Cement", "ACC Cement", "Shree Cement", 
              "Tata Tiscon", "Finolex", "Legrand", "Havells", 
              "Jaquar", "Asian Paints", "Kohler", "Schneider", 
              "Cera", "Dr Fixit"
            ].map((brand) => (
              <div key={brand} className="bg-white rounded-xl h-24 flex items-center justify-center p-4 shadow-sm hover:scale-105 transition-transform cursor-pointer border-2 border-[#FF6A00] relative group">
                <img 
                  src={`/assets/logos/${brand.replace(/ /g, '_')}.png`} 
                  alt={brand}
                  className="max-w-full max-h-full object-contain transition-opacity duration-300 p-2"
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden font-bold text-[#0A1D3A] text-center text-sm md:text-base leading-tight">
                  {brand}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:text-left text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2">
            Every brand is carefully selected and verified to meet our strict quality standards.
          </div>
        </div>
      </section>

      {/* ─── 4. CTA SECTION ─── */}
      <section className="py-16 bg-gradient-to-r from-[#051124] to-[#0A1D3A] relative overflow-hidden dark-nav-trigger">
        <div className="container-rc relative z-10">
          <div className="bg-[#0A1D3A]/50 border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row backdrop-blur-sm relative">
            
            {/* Left: Mascot Image */}
            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
              <img 
                src="/assets/brand-standards/mascot.png" 
                alt="Expert Guide" 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 h-full object-contain"
              />
            </div>

            {/* Right: Content */}
            <div className="md:w-2/3 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
              
              <div className="space-y-6 flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Need help selecting the right materials <br className="hidden lg:block"/> for your project?
                </h2>
                <p className="text-gray-300 text-lg">
                  Our experts are here to guide you.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                  <ContactModal defaultService="Brand Standards Consultation">
                    <button className="bg-transparent border border-white hover:bg-white hover:text-[#0A1D3A] text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" /> LET'S TALK
                    </button>
                  </ContactModal>
                  <ContactModal defaultService="Brand Material Request">
                    <button className="bg-[#FF6A00] hover:bg-[#E65F00] text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-[#FF6A00]/20">
                      REQUEST INFO <ArrowRight className="w-5 h-5" />
                    </button>
                  </ContactModal>
                </div>
              </div>

              {/* Vertical Checks */}
              <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 w-full md:w-auto">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-5 h-5 text-[#FF6A00]" />
                  <span className="text-white font-semibold">Expert Guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FF6A00]" />
                  <span className="text-white font-semibold">Verified Quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#FF6A00]" />
                  <span className="text-white font-semibold">On-time Delivery</span>
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
