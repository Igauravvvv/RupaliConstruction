import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import CinematicReveal from "@/sections/CinematicReveal";
import TrustBar from "@/sections/TrustBar";
import WhyUs from "@/sections/WhyUs";
import Services from "@/sections/Services";
import Projects from "@/sections/Projects";
import Testimonials from "@/sections/Testimonials";
import EstimateSection from "@/sections/EstimateSection";
import FAQ from "@/sections/FAQ";
import Footer from "@/sections/Footer";
import PromoPopup from "@/components/PromoPopup";

import SEO from "@/components/SEO";

import InstagramFeed from "@/sections/InstagramFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden">
      <SEO 
        title="AI-Powered Home Construction Company In Gurgaon | Best Luxury House Builders | Rupali Construction"
        description="Rupali Construction is Gurgaon's premier AI-powered home construction company offering turnkey villa building, 2D/3D Vastu architectural designs, licensed structural engineering, luxury interior solutions, and intelligent cost estimation across Delhi NCR."
        keywords="home construction company in gurugram, best home builders in gurgaon, AI construction Gurgaon, house construction delhi ncr, luxury residential builders, turnkey villa construction, architects in sector 71 gurgaon, rupali construction"
        url="/"
      />
      <Navbar />
      <Hero />
      <CinematicReveal />
      <TrustBar />
      <WhyUs />
      <Services />
      <Projects />
      <InstagramFeed />
      <Testimonials />
      <EstimateSection />
      <FAQ />
      <Footer />
      <PromoPopup />
    </div>
  );
}
