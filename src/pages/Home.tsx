import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import TrustBar from "@/sections/TrustBar";
import WhyUs from "@/sections/WhyUs";
import Services from "@/sections/Services";
import Projects from "@/sections/Projects";
import Testimonials from "@/sections/Testimonials";
import EstimateSection from "@/sections/EstimateSection";
import FAQ from "@/sections/FAQ";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustBar />
      <WhyUs />
      <Services />
      <Projects />
      <Testimonials />
      <EstimateSection />
      <FAQ />
      <Footer />
    </div>
  );
}
