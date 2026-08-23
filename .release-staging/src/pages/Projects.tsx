import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import ProjectsSection from "@/sections/Projects";
import TrustBar from "@/sections/TrustBar";

import PortfolioSkyscraperLeft from "@/components/PortfolioSkyscraperLeft";
import PortfolioSkyscraperRight from "@/components/PortfolioSkyscraperRight";
import SEO from "@/components/SEO";

export default function Projects() {
  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden relative">
      <SEO 
        title="Luxury Villa Projects & Portfolio in Gurgaon | Rupali Construction" 
        description="Explore our exclusive portfolio of delivered luxury residential villas, custom custom estates, turnkey renovations, and commercial architectures in Gurugram and Delhi NCR."
        keywords="luxury projects Gurgaon, residential villas built Gurgaon, construction portfolio Gurgaon, turnkey houses Sector 71, luxury custom home designs"
        url="/projects"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Luxury Projects Portfolio - Rupali Construction",
            "description": "Showcase of residential villas, commercial landmarks, and architectural masterpieces constructed in Gurgaon."
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://rupaliconstruction.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Projects",
                "item": "https://rupaliconstruction.com/projects"
              }
            ]
          }
        ]}
      />
      <Navbar />
      
      {/* Background Image with Premium Gradient Fade */}
      <div className="absolute top-0 left-0 w-full h-[70vh] z-0 pointer-events-none">
        <img loading="lazy" 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80" 
          alt="Luxury Construction Projects"
          className="w-full h-full object-cover object-[center_20%] opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--rc-white)] via-[var(--rc-white)]/90 to-transparent" />
      </div>

      <main className="relative z-10">
        <div className="relative z-10">
          <div className="pt-24 lg:pt-32">
            <TrustBar variant="transparent" />
          </div>

          {/* Projects Grid from Section */}
          <div className="py-8 bg-transparent pb-24 -mt-16">
             <ProjectsSection />
          </div>
        </div>

        {/* Full-page Skyscrapers */}
        <PortfolioSkyscraperLeft className="absolute left-0 top-[14rem] lg:top-[16rem] bottom-0 opacity-20 z-50 pointer-events-none mix-blend-multiply" />
        <PortfolioSkyscraperRight className="absolute right-0 top-[14rem] lg:top-[16rem] bottom-0 opacity-20 z-50 pointer-events-none mix-blend-multiply" />
      </main>
      
      <Footer />
    </div>
  );
}
