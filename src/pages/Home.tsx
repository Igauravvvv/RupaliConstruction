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

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden">
      <Navbar />
      <Hero />
      <CinematicReveal />
      <TrustBar />
      <WhyUs />
      <Services />
      <Projects />
      <Testimonials />
      <EstimateSection />
      <FAQ />
      <Footer />
      <PromoPopup />
    </div>
  );
}
