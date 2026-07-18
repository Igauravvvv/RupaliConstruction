import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { categories, Category } from "@/data/brandStandardsData";
import BrandDrawer from "@/components/brand-standards/BrandDrawer";
import { 
  ShieldCheck, 
  LayoutGrid, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  BadgeCheck,
  Clock
} from "lucide-react";

export default function BrandStandards() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ─── 1. HERO SECTION ─── */}
      <section className="bg-[#0A1D3A] pt-32 pb-20 relative overflow-hidden dark-nav-trigger">
        <div className="container-rc relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            {/* Left Content */}
            <div className="lg:w-1/2 text-white space-y-8">
              <div>
                <p className="text-[#FF6A00] font-bold text-sm tracking-widest uppercase mb-4">
                  Our Brand Standards
                </p>
                <h1 className="text-5xl lg:text-[4rem] font-bold leading-[1.1] mb-6">
                  STANDARDS THAT <br />
                  <span className="text-[#FF6A00]">BUILD TRUST.</span>
                </h1>
                <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                  We work with premium and verified brands to deliver quality, safety, and excellence in every project.
                </p>
              </div>

              {/* Trust Metrics */}
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                    <ShieldCheck className="w-6 h-6 text-[#FF6A00]" />
                  </div>
                  <div>
                    <p className="font-bold text-xl leading-none">30+</p>
                    <p className="text-xs text-gray-400 mt-1">Premium Brands</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                    <LayoutGrid className="w-6 h-6 text-[#FF6A00]" />
                  </div>
                  <div>
                    <p className="font-bold text-xl leading-none">4</p>
                    <p className="text-xs text-gray-400 mt-1">Category Groups</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                    <CheckCircle2 className="w-6 h-6 text-[#FF6A00]" />
                  </div>
                  <div>
                    <p className="font-bold text-xl leading-none">100%</p>
                    <p className="text-xs text-gray-400 mt-1">Quality Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" 
                  alt="Modern Luxury Home at Dusk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1D3A]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. EXPLORE BY CATEGORY ─── */}
      <section className="py-24 bg-[#F4F6F8]">
        <div className="container-rc">
          <div className="mb-12">
            <p className="text-[#FF6A00] font-bold text-sm tracking-widest uppercase mb-2">
              Explore By Category
            </p>
            <h2 className="text-4xl font-bold text-[#0A1D3A]">
              Choose a Category to Explore<br />Our Trusted Brands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div 
                key={category.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group cursor-pointer"
                onClick={() => setActiveCategory(category)}
              >
                {/* Top Image */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <img 
                    src={`/assets/brand-standards/${category.name.toLowerCase()}/${category.subcategories[0]?.brands[0]?.name.toLowerCase().replace(' ', '-') || 'default'}.webp`} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541888087425-ce81dfc46928?w=600&q=80"; // Fallback texture
                    }}
                  />
                  
                  {/* Floating Circle Icon */}
                  <div 
                    className="absolute -bottom-6 left-6 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white shadow-md z-10"
                    style={{ backgroundColor: category.color }}
                  >
                    <category.icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="pt-10 pb-6 px-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-[#0A1D3A] mb-1">{category.name}</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-4">{category.subcategories.length} Sub-Categories</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {category.description}
                  </p>
                  
                  <div className="mt-auto flex justify-end">
                    <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#FF6A00] group-hover:border-[#FF6A00] group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "UltraTech", "Ambuja Cement", "Tata Tiscon", "Finolex", "Legrand", "Havells",
              "Jaquar", "Asian Paints", "Kohler", "Schneider", "Cera"
            ].map((brand) => (
              <div key={brand} className="bg-white rounded-xl h-24 flex items-center justify-center p-4 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                {/* Fallback to text since we don't have SVGs for all */}
                <span className="font-bold text-[#0A1D3A] text-center text-sm md:text-base leading-tight">
                  {brand}
                </span>
              </div>
            ))}
            <div className="bg-white/10 rounded-xl h-24 flex items-center justify-center p-4 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
              <span className="font-bold text-[#FF6A00] text-center text-sm">
                +20<br />More Brands
              </span>
            </div>
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
                className="absolute bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-8 h-[120%] object-contain"
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
                  <button className="bg-transparent border border-white hover:bg-white hover:text-[#0A1D3A] text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> LET'S TALK
                  </button>
                  <button className="bg-[#FF6A00] hover:bg-[#E65F00] text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-[#FF6A00]/20">
                    REQUEST INFO <ArrowRight className="w-5 h-5" />
                  </button>
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

      {/* ─── Persistent Drawer ─── */}
      <BrandDrawer 
        isOpen={!!activeCategory} 
        onClose={() => setActiveCategory(null)} 
        category={activeCategory} 
      />
    </div>
  );
}
