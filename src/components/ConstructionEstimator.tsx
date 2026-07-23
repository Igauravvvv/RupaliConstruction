import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ArrowRight, CheckCircle2, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

// --- DATA MODEL ---

export type Tier = "normal" | "premium" | "luxury";

export interface Category {
  id: string;
  name: string;
  iconImage: string;
  weightPercent: number;
}

export interface Product {
  id: string;
  categoryId: string;
  brandName: string;
  tier: Tier;
  multiplier: number; // 1.0 for normal, >1.0 for premium/luxury
  specs: string[];
}

export const CATEGORIES: Category[] = [
  { id: "c_cement", name: "Cement", iconImage: "/icons/icon_cement.png", weightPercent: 15 },
  { id: "c_steel", name: "Steel / TMT", iconImage: "/icons/icon_steel.png", weightPercent: 20 },
  { id: "c_bricks", name: "Bricks / Blocks", iconImage: "/icons/icon_bricks.png", weightPercent: 12 },
  { id: "c_electrical", name: "Electrical", iconImage: "/icons/icon_electrical.png", weightPercent: 10 },
  { id: "c_plumbing", name: "Plumbing", iconImage: "/icons/icon_plumbing.png", weightPercent: 10 },
  { id: "c_paint", name: "Paint", iconImage: "/icons/icon_paint.png", weightPercent: 6 },
  { id: "c_putty", name: "Wall Putty", iconImage: "/icons/icon_putty.png", weightPercent: 5 },
  { id: "c_labor", name: "Labor & Finish", iconImage: "/icons/icon_labor.png", weightPercent: 22 },
];

export const PRODUCTS: Product[] = [
  // Cement
  { id: "p_cem_ambuja", categoryId: "c_cement", brandName: "Ambuja", tier: "normal", multiplier: 1.0, specs: ["OPC 43 Grade", "High Strength", "Weather Resistant"] },
  { id: "p_cem_acc", categoryId: "c_cement", brandName: "ACC", tier: "premium", multiplier: 1.15, specs: ["OPC 53 Grade", "Rapid Hardening", "Corrosion Resistant"] },
  { id: "p_cem_ultratech", categoryId: "c_cement", brandName: "UltraTech", tier: "luxury", multiplier: 1.3, specs: ["Super Grade", "Advanced Slag", "Zero Seepage Guarantee"] },
  
  // Steel
  { id: "p_stl_local", categoryId: "c_steel", brandName: "Standard TMT", tier: "normal", multiplier: 1.0, specs: ["Fe 500", "ISI Marked", "Standard Ductility"] },
  { id: "p_stl_jsw", categoryId: "c_steel", brandName: "JSW Neo", tier: "premium", multiplier: 1.2, specs: ["Fe 500D", "High Ductility", "Earthquake Resistant"] },
  { id: "p_stl_tata", categoryId: "c_steel", brandName: "Tata Tiscon", tier: "luxury", multiplier: 1.4, specs: ["Fe 550D", "Super Ductile", "Anti-Corrosive Coating"] },
  
  // Bricks
  { id: "p_brk_clay", categoryId: "c_bricks", brandName: "Red Clay Bricks", tier: "normal", multiplier: 1.0, specs: ["Standard Class A", "Local Kiln", "High Thermal Mass"] },
  { id: "p_brk_aac", categoryId: "c_bricks", brandName: "AAC Blocks", tier: "premium", multiplier: 1.2, specs: ["Lightweight", "Excellent Insulation", "Faster Construction"] },
  { id: "p_brk_premium", categoryId: "c_bricks", brandName: "Premium Porotherm", tier: "luxury", multiplier: 1.5, specs: ["Hollow Blocks", "Acoustic Insulation", "Eco-friendly"] },

  // Electrical
  { id: "p_elec_polycab", categoryId: "c_electrical", brandName: "Polycab", tier: "normal", multiplier: 1.0, specs: ["Standard Copper", "FR Grade PVC", "Modular Switches"] },
  { id: "p_elec_finolex", categoryId: "c_electrical", brandName: "Finolex", tier: "premium", multiplier: 1.25, specs: ["High Conductivity", "FRLS Grade", "Premium Switches"] },
  { id: "p_elec_havells", categoryId: "c_electrical", brandName: "Havells", tier: "luxury", multiplier: 1.5, specs: ["Zero Halogen", "Smart Home Ready", "Luxury Glass Switches"] },

  // Plumbing
  { id: "p_plumb_standard", categoryId: "c_plumbing", brandName: "Standard CPVC", tier: "normal", multiplier: 1.0, specs: ["SDR 11 Pipes", "Basic Fittings", "1 Year Warranty"] },
  { id: "p_plumb_finolex", categoryId: "c_plumbing", brandName: "Finolex", tier: "premium", multiplier: 1.3, specs: ["High Pressure CPVC", "Brass Threaded", "Lead-free"] },
  { id: "p_plumb_astral", categoryId: "c_plumbing", brandName: "Astral Pipes", tier: "luxury", multiplier: 1.6, specs: ["Silencio Pipes", "Antibacterial", "Lifetime Warranty"] },

  // Paint
  { id: "p_pnt_nerolac", categoryId: "c_paint", brandName: "Nerolac", tier: "normal", multiplier: 1.0, specs: ["Interior Distemper", "Basic Weather Coat", "Standard Matte"] },
  { id: "p_pnt_berger", categoryId: "c_paint", brandName: "Berger", tier: "premium", multiplier: 1.3, specs: ["Silk Glamor", "WeatherCoat Long Life", "Washable"] },
  { id: "p_pnt_asian", categoryId: "c_paint", brandName: "Asian Paints", tier: "luxury", multiplier: 1.7, specs: ["Royale Play", "Ultima Protek", "Teflon Surface Protection"] },

  // Putty
  { id: "p_pty_walplast", categoryId: "c_putty", brandName: "WalPlast", tier: "normal", multiplier: 1.0, specs: ["Cement Based", "Standard Finish", "Good Adhesion"] },
  { id: "p_pty_jk", categoryId: "c_putty", brandName: "JK Wall Putty", tier: "premium", multiplier: 1.2, specs: ["White Cement Based", "Smooth Finish", "Water Resistant"] },
  { id: "p_pty_birla", categoryId: "c_putty", brandName: "Birla White", tier: "luxury", multiplier: 1.4, specs: ["Excel Putty", "Superior Whiteness", "Anti-Flaking"] },

  // Labor
  { id: "p_lab_standard", categoryId: "c_labor", brandName: "Standard Contracting", tier: "normal", multiplier: 1.0, specs: ["Experienced Labor", "Basic Supervision", "Standard Timeline"] },
  { id: "p_lab_premium", categoryId: "c_labor", brandName: "Premium Contracting", tier: "premium", multiplier: 1.3, specs: ["Specialized Crews", "Daily Quality Checks", "Faster Execution"] },
  { id: "p_lab_luxury", categoryId: "c_labor", brandName: "Luxury Turnkey", tier: "luxury", multiplier: 1.7, specs: ["Master Craftsmen", "Dedicated Engineer", "Flawless Finishing"] },
];

export const TIER_DEFAULTS: Record<Tier, Record<string, string>> = {
  normal: {},
  premium: {},
  luxury: {},
};

// Auto-fill tier defaults based on the products array
CATEGORIES.forEach(cat => {
  ["normal", "premium", "luxury"].forEach(tier => {
    const product = PRODUCTS.find(p => p.categoryId === cat.id && p.tier === tier) 
                 || PRODUCTS.find(p => p.categoryId === cat.id); // fallback
    if (product) {
      TIER_DEFAULTS[tier as Tier][cat.id] = product.id;
    }
  });
});

const getBaseRate = (city: string, foundation: string) => {
  let rate = 1500;
  if (city === "Delhi") rate += 200;
  if (city === "Gurgaon") rate += 100;
  
  if (foundation === "Deep/Raft") rate += 300;
  if (foundation === "Pile") rate += 500;
  return rate;
};

// --- ANIMATED COUNTER COMPONENT ---
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    if (start === end) return;

    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const current = start + (end - start) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.round(displayValue));

  return <span>{formatted}</span>;
}

// --- MAIN COMPONENT ---

export default function ConstructionEstimator() {
  const [mode, setMode] = useState<"setup" | "quick" | "detailed">("setup");
  
  const [inputs, setInputs] = useState({
    city: "",
    plotArea: "",
    floors: "1",
    foundation: "",
  });

  // Cart maps categoryId to productId
  const [cart, setCart] = useState<Record<string, string>>(TIER_DEFAULTS.normal);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Core Pricing Formula
  const calculateTotal = (currentCart: Record<string, string>) => {
    const area = parseInt(inputs.plotArea) || 0;
    const floors = parseInt(inputs.floors) || 0;
    const baseRate = getBaseRate(inputs.city, inputs.foundation);

    const multiplierSum = CATEGORIES.reduce((sum, cat) => {
      const productId = currentCart[cat.id];
      const product = PRODUCTS.find(p => p.id === productId);
      const mult = product ? product.multiplier : 1.0;
      return sum + (cat.weightPercent / 100) * mult;
    }, 0);

    return area * floors * baseRate * multiplierSum;
  };

  const currentTotal = calculateTotal(cart);

  const handleSelectPackage = (tier: Tier) => {
    setCart({ ...TIER_DEFAULTS[tier] });
    setMode("detailed");
  };

  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--rc-border)] w-full max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="bg-[var(--rc-dark)] p-6 lg:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--rc-orange)]/20 flex items-center justify-center text-[var(--rc-orange)]">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-semibold">Cost Estimator</h3>
          </div>
          <p className="text-white/60 text-sm">
            {mode === "setup" ? "Enter your project details to get started." 
            : mode === "quick" ? "Select a package or customize it to your exact needs."
            : "Customize every material for a precise construction estimate."}
          </p>
        </div>
        
        {mode !== "setup" && (
          <button 
            onClick={() => setMode("setup")}
            className="text-sm px-4 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors self-start md:self-auto"
          >
            Edit Project Details
          </button>
        )}
      </div>

      {/* SETUP MODE */}
      {mode === "setup" && (
        <div className="p-6 lg:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-label text-[var(--rc-muted)] block">City</label>
              <div className="grid grid-cols-2 gap-3">
                {["Gurgaon", "Delhi", "Noida", "Faridabad"].map(c => (
                  <button key={c}
                    onClick={() => setInputs(p => ({ ...p, city: c }))}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      inputs.city === c 
                        ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/10 text-[var(--rc-dark)] font-semibold ring-1 ring-[var(--rc-orange)]" 
                        : "border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-blue)]/30"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-label text-[var(--rc-muted)] block">Foundation Type</label>
              <div className="grid grid-cols-2 gap-3">
                {["Standard / Strip", "Deep/Raft", "Pile"].map(f => (
                  <button key={f}
                    onClick={() => setInputs(p => ({ ...p, foundation: f }))}
                    className={`p-3 rounded-xl border text-center text-sm transition-all ${
                      inputs.foundation === f 
                        ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/10 text-[var(--rc-dark)] font-semibold ring-1 ring-[var(--rc-orange)]" 
                        : "border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-blue)]/30"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-label text-[var(--rc-muted)] block">Plot Area (Sq.Ft.)</label>
              <input 
                type="number"
                value={inputs.plotArea}
                onChange={(e) => setInputs(p => ({ ...p, plotArea: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-orange)] focus:ring-2 focus:ring-[var(--rc-orange)] outline-none text-lg"
                placeholder="e.g. 2000"
              />
            </div>

            <div className="space-y-3">
              <label className="text-label text-[var(--rc-muted)] block">Number of Floors</label>
              <div className="flex gap-2">
                {['1', '2', '3', '4'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setInputs(p => ({ ...p, floors: num }))}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all border ${
                      inputs.floors === num
                        ? "bg-[var(--rc-blue)] border-[var(--rc-blue)] text-white shadow-md"
                        : "bg-white border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-blue)] hover:text-[var(--rc-blue)]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setInputs(p => ({ ...p, floors: parseInt(inputs.floors) > 4 ? inputs.floors : '5' }))}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all border ${
                    parseInt(inputs.floors || '1') > 4
                      ? "bg-[var(--rc-blue)] border-[var(--rc-blue)] text-white shadow-md"
                      : "bg-white border-[var(--rc-border)] text-[var(--rc-muted)] hover:border-[var(--rc-blue)] hover:text-[var(--rc-blue)]"
                  }`}
                >
                  More
                </button>
              </div>
              {parseInt(inputs.floors || '1') > 4 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <input 
                    type="number"
                    min="5" max="100"
                    value={inputs.floors}
                    onChange={(e) => setInputs(p => ({ ...p, floors: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--rc-border)] focus:border-[var(--rc-blue)] focus:ring-2 focus:ring-[var(--rc-blue)] outline-none text-lg mt-2 transition-all"
                    placeholder="Enter number of floors (e.g. 5)"
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-[var(--rc-border)]">
            <button
              disabled={!inputs.city || !inputs.plotArea || !inputs.foundation}
              onClick={() => setMode("quick")}
              className="px-8 py-4 bg-[var(--rc-orange)] text-white rounded-full font-medium text-lg hover:bg-[var(--rc-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              See Estimate <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* QUICK MODE (Mode A) */}
      {mode === "quick" && (
        <div className="p-6 lg:p-10 bg-[var(--rc-gray)] animate-in fade-in slide-in-from-right-8">
          <h4 className="text-center text-xl font-medium text-[var(--rc-dark)] mb-8">Choose a starting package to view costs</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(['normal', 'premium', 'luxury'] as Tier[]).map((tier) => {
              const packageTotal = calculateTotal(TIER_DEFAULTS[tier]);
              const perSqFt = packageTotal / (parseInt(inputs.plotArea) * parseInt(inputs.floors));
              
              return (
                <div key={tier} className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--rc-border)] flex flex-col group hover:border-[var(--rc-orange)] hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  {tier === 'premium' && (
                    <div className="absolute top-0 right-0 bg-[var(--rc-orange)] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg z-10 shadow-sm">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-2xl font-serif text-[var(--rc-blue)] capitalize mb-1">{tier}</h3>
                    <p className="text-sm text-[var(--rc-muted)]">
                      {tier === 'normal' ? 'Perfect for standard requirements' : 
                       tier === 'premium' ? 'High-quality fittings & superior finish' : 
                       'Imported materials & smart features'}
                    </p>
                  </div>
                  
                  <div className="my-6 py-6 border-y border-[var(--rc-border)]">
                    <div className="text-3xl font-bold text-[var(--rc-dark)] mb-1">
                      <AnimatedPrice value={packageTotal} />
                    </div>
                    <div className="text-sm text-[var(--rc-muted)]">
                      Approx. {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(perSqFt)} / sq.ft.
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {PRODUCTS.filter(p => p.tier === tier).slice(0, 4).map(p => (
                      <li key={p.id} className="flex items-start gap-2 text-sm text-[var(--rc-dark)]">
                        <CheckCircle2 className="w-4 h-4 text-[var(--rc-orange)] shrink-0 mt-0.5" />
                        <span>{p.brandName} {CATEGORIES.find(c => c.id === p.categoryId)?.name}</span>
                      </li>
                    ))}
                    <li className="text-sm text-[var(--rc-muted)] italic pl-6">+ more included</li>
                  </ul>

                  <button 
                    onClick={() => handleSelectPackage(tier)}
                    className="w-full py-3 rounded-xl border-2 border-[var(--rc-blue)] text-[var(--rc-blue)] font-medium group-hover:bg-[var(--rc-blue)] group-hover:text-white transition-colors"
                  >
                    Customize this Package
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED MODE (Mode B) */}
      {mode === "detailed" && (
        <div className="flex flex-col-reverse lg:flex-row bg-white animate-in fade-in slide-in-from-bottom-8">
          
          {/* Main Content Area */}
          <div className="flex-1 border-r border-[var(--rc-border)] flex flex-col">
            
            {/* Category Ribbon */}
            <div className="border-b border-[var(--rc-border)] bg-[var(--rc-gray)] sticky top-0 z-20 shadow-sm">
              <div className="flex items-center p-2 lg:p-4">
                <button onClick={() => scrollCategories('left')} className="p-2 hover:bg-black/5 rounded-full hidden md:block transition-colors">
                  <ChevronLeft className="w-5 h-5 text-[var(--rc-dark)]" />
                </button>
                
                <div 
                  ref={categoryScrollRef}
                  className="flex-1 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-2 pb-2 pt-1"
                >
                  {CATEGORIES.map(cat => {
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button 
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex flex-col items-center min-w-[90px] lg:min-w-[110px] p-3 rounded-xl transition-all shrink-0 ${
                          isSelected 
                            ? "bg-white shadow-md border border-[var(--rc-orange)] ring-1 ring-[var(--rc-orange)] scale-105 transform z-10" 
                            : "bg-transparent border border-transparent hover:bg-white/50"
                        }`}
                      >
                        <div className={`w-10 h-10 lg:w-14 lg:h-14 mb-2 rounded-lg overflow-hidden flex items-center justify-center p-1 transition-colors ${isSelected ? "bg-[var(--rc-orange)]/10" : "bg-[var(--rc-dark)]/5"}`}>
                          <img src={cat.iconImage} alt={cat.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <span className={`text-xs lg:text-sm font-medium ${isSelected ? "text-[var(--rc-orange)]" : "text-[var(--rc-muted)]"}`}>
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button onClick={() => scrollCategories('right')} className="p-2 hover:bg-black/5 rounded-full hidden md:block transition-colors">
                  <ChevronRight className="w-5 h-5 text-[var(--rc-dark)]" />
                </button>
              </div>
            </div>

            {/* Product Selection */}
            <div className="p-6 lg:p-8 bg-white flex-1 relative min-h-[500px]">
              <div className="mb-6">
                <h4 className="text-2xl font-serif text-[var(--rc-blue)]">{CATEGORIES.find(c => c.id === activeCategory)?.name} Options</h4>
                <p className="text-[var(--rc-muted)] text-sm mt-1">Select the brand and quality tier for this material.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {PRODUCTS.filter(p => p.categoryId === activeCategory).map(product => {
                    const isSelected = cart[activeCategory] === product.id;
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        key={product.id}
                        className={`rounded-2xl border-2 p-5 transition-all flex flex-col ${
                          isSelected 
                            ? "border-[var(--rc-orange)] bg-[var(--rc-orange)]/5 shadow-[0_4px_20px_-4px_rgba(217,119,6,0.15)]" 
                            : "border-[var(--rc-border)] hover:border-[var(--rc-blue)]/50 hover:shadow-md cursor-pointer"
                        }`}
                        onClick={() => !isSelected && setCart(prev => ({ ...prev, [activeCategory]: product.id }))}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h5 className="text-xl font-semibold text-[var(--rc-dark)] pr-2">{product.brandName}</h5>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shrink-0 ${
                            product.tier === 'normal' ? 'bg-gray-200 text-gray-700' :
                            product.tier === 'premium' ? 'bg-[var(--rc-blue)]/10 text-[var(--rc-blue)]' :
                            'bg-[var(--rc-orange)] text-white shadow-sm'
                          }`}>
                            {product.tier}
                          </span>
                        </div>

                        <ul className="space-y-2 mb-6 flex-1">
                          {product.specs.map(spec => (
                            <li key={spec} className="flex items-start gap-2 text-sm text-[var(--rc-muted)]">
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--rc-orange)] mt-1.5 shrink-0" />
                              <span className="leading-snug">{spec}</span>
                            </li>
                          ))}
                        </ul>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCart(prev => ({ ...prev, [activeCategory]: product.id }));
                          }}
                          className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                            isSelected 
                              ? "bg-[var(--rc-orange)] text-white shadow-md shadow-[var(--rc-orange)]/30" 
                              : "bg-[var(--rc-gray)] text-[var(--rc-dark)] hover:bg-[var(--rc-dark)] hover:text-white"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" /> Selected
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" /> Add to Cart
                            </>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sticky Total Panel (Mobile: Bottom, Desktop: Right) */}
          <div className="w-full lg:w-[320px] xl:w-[350px] bg-[var(--rc-dark)] text-white p-6 lg:p-8 flex flex-col sticky bottom-0 lg:top-0 h-auto lg:h-[800px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] lg:shadow-2xl z-30 shrink-0">
            <h4 className="text-white/60 font-medium text-sm tracking-widest uppercase mb-6 hidden lg:block">Live Estimate</h4>
            
            <div className="mb-4 lg:mb-8 flex flex-row lg:flex-col items-center lg:items-start justify-between">
              <div>
                <div className="text-sm text-white/60 mb-1 lg:mb-2">Total Project Cost</div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--rc-orange)] tracking-tight">
                  <AnimatedPrice value={currentTotal} />
                </div>
              </div>
              <div className="text-xs sm:text-sm text-white/50 mt-0 lg:mt-2 text-right lg:text-left">
                {inputs.plotArea} sq.ft<br className="block lg:hidden" /> × {inputs.floors} floor(s)
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar hidden lg:block space-y-4 mb-6">
              <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Cart Summary</div>
              {CATEGORIES.map(cat => {
                const selectedProd = PRODUCTS.find(p => p.id === cart[cat.id]);
                return (
                  <div key={cat.id} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 p-1 shrink-0 flex items-center justify-center">
                        <img src={cat.iconImage} alt="" className="w-full h-full object-contain mix-blend-screen opacity-80" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/90">{cat.name}</div>
                        <div className="text-xs text-white/50 truncate max-w-[120px] xl:max-w-[150px]">{selectedProd?.brandName}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveCategory(cat.id)}
                      className="text-xs text-[var(--rc-orange)] hover:underline ml-2"
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-auto lg:pt-6 lg:border-t border-white/10 flex flex-col gap-3">
              <button className="w-full py-3.5 bg-white text-[var(--rc-dark)] font-bold rounded-xl hover:bg-[var(--rc-orange)] hover:text-white transition-colors shadow-lg">
                Download PDF Quote
              </button>
              <button 
                onClick={() => setMode("quick")}
                className="w-full text-center text-xs text-white/40 hover:text-white py-2"
              >
                Back to Packages
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
