import { business, homeSeo, localFaqSchema } from "../../shared/local-seo";
import { Link } from "react-router";
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
        {...homeSeo}
        schema={localFaqSchema}
        url="/"
      />
      <Navbar />
      <Hero />
      <CinematicReveal />
      <TrustBar />
      <section className="py-12 lg:py-16 bg-[var(--rc-white)]" aria-labelledby="gurugram-builder">
        <div className="container-rc max-w-4xl">
          <h2 id="gurugram-builder" className="text-display-2 text-[var(--rc-dark)] mb-4">Looking for the best builder in Gurugram?</h2>
          <p className="text-[var(--rc-muted)] leading-relaxed mb-4">Rupali Construction provides home construction, turnkey villas, architecture, renovation and interiors in Gurugram (Gurgaon) and Delhi NCR. Discuss your plot, design and budget with our team at M3M Broadway, Sector 71.</p>
          <h3 className="text-xl font-semibold text-[var(--rc-dark)] mb-3">Choose the best contractor in Gurugram for your project</h3>
          <p className="text-[var(--rc-muted)] leading-relaxed mb-5">Compare completed work, material specifications, a clear scope and a written estimate before choosing your contractor. Review our projects and construction standards to see how we approach your home.</p>
          <div className="flex flex-wrap gap-5 text-[var(--rc-blue)] underline underline-offset-4">
            <Link to="/services">Construction services</Link>
            <Link to="/projects">View our projects</Link>
            <Link to="/brand-standards">Material standards</Link>
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer">Rupali Construction on Google Maps</a>
          </div>
        </div>
      </section>
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
