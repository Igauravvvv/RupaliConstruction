import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import ServicesSection from "@/sections/Services";
import ConstructionProcess from "@/components/ConstructionProcess";

import SEO from "@/components/SEO";

export default function Services() {
  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden relative">
      <SEO 
        title="Luxury Construction & Architectural Services in Gurgaon | Rupali Construction" 
        description="Explore our comprehensive suite of luxury residential construction, turnkey interior design, villa renovation, architectural engineering, and real estate resale services in Gurugram."
        keywords="luxury construction Gurgaon, villa construction services, interior design Sector 71 Gurgaon, architecture company Haryana, turnkey contractor Gurgaon"
        url="/services"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Residential & Luxury Villa Construction",
            "provider": {
              "@type": "HomeAndConstructionBusiness",
              "name": "Rupali Construction"
            },
            "areaServed": {
              "@type": "City",
              "name": "Gurugram"
            },
            "description": "Custom residential villa construction, turnkey interiors, structural engineering, and real estate consulting."
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
                "name": "Services",
                "item": "https://rupaliconstruction.com/services"
              }
            ]
          }
        ]}
      />
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
