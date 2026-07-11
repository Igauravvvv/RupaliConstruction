import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import ProjectsSection from "@/sections/Projects";
import TrustBar from "@/sections/TrustBar";

import PortfolioSkyscraperLeft from "@/components/PortfolioSkyscraperLeft";
import PortfolioSkyscraperRight from "@/components/PortfolioSkyscraperRight";

export default function Projects() {
  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden">
      <Navbar />
      
      <main className="relative">
        <div className="relative z-10">
          <div className="pt-24 lg:pt-32">
            <TrustBar variant="transparent" />
          </div>

          {/* Projects Grid from Section */}
          <div className="py-8 bg-[var(--rc-white)] pb-24 -mt-16">
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
