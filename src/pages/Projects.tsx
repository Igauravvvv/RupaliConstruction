import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import ProjectsSection from "@/sections/Projects";

export default function Projects() {
  return (
    <div className="min-h-screen bg-[var(--rc-gray)]">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-start pointer-events-none opacity-[0.03] -translate-x-1/4">
          <img
            src="/logo-icon.png"
            alt=""
            className="w-full max-w-[1000px] object-contain"
          />
        </div>
        <div className="container-rc relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-semibold text-[var(--rc-dark)] tracking-tight mb-6">
            Our <span className="text-[var(--rc-blue)]">Portfolio</span>
          </h1>
          <p className="text-lg text-[var(--rc-muted)] leading-relaxed">
            Explore our curated selection of premium residential, commercial, and renovation projects. See how we turn architectural vision into stunning reality.
          </p>
        </div>
      </div>

      {/* Projects Grid from Section */}
      <div className="py-8 bg-[var(--rc-gray)] pb-24 -mt-16">
         <ProjectsSection />
      </div>
      
      <Footer />
    </div>
  );
}
