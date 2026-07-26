import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import ServicesSection from "@/sections/Services";
import ConstructionProcess from "@/components/ConstructionProcess";

import SEO from "@/components/SEO";

export default function Services() {
  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden relative">
      <SEO title="Our Services | Rupali Construction" description="Explore our comprehensive suite of construction, design, and engineering services." />
      <Navbar />
      
      {/* Background Image with Premium Gradient Fade */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="sticky top-0 w-full h-screen">
          <img loading="lazy" 
            src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Professional Construction Team Services"
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--rc-white)]/60 to-[var(--rc-white)]" />
        </div>
      </div>

      <main className="relative z-10">
        <div className="relative z-10">
          <div className="pt-24 lg:pt-32 bg-transparent pb-10">
             <ServicesSection transparentBg />
          </div>
          <ConstructionProcess />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
