import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import ServicesSection from "@/sections/Services";
import ConstructionProcess from "@/components/ConstructionProcess";
import SEO from "@/components/SEO";
import { servicesData, ServiceDetailItem } from "@/data/servicesData";
import ConsultationModal from "@/components/ConsultationModal";
import { 
  Sparkles, CheckCircle2, ShieldCheck, Clock, 
  ArrowRight, Home, Building2, Hammer, Paintbrush, Compass, HardHat 
} from "lucide-react";

const iconMap = {
  Home,
  Building2,
  Hammer,
  Paintbrush,
  Compass,
  HardHat,
};

export default function Services() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("residential-construction");
  const [consultService, setConsultService] = useState<string | null>(null);

  const activeService: ServiceDetailItem = 
    servicesData.find(s => s.id === selectedServiceId) || servicesData[0];
  
  const ActiveIcon = iconMap[activeService.iconName] || Home;

  return (
    <div className="min-h-screen bg-[var(--rc-white)] overflow-x-hidden relative">
      <SEO 
        title="Luxury Construction & Architectural Services in Gurgaon | Rupali Construction" 
        description="Explore our comprehensive suite of luxury residential construction, turnkey interior design, villa renovation, architectural engineering, and commercial assets in Gurugram."
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
          <img 
            src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            srcSet="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=70 800w, https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80 1920w"
            sizes="100vw"
            alt="Professional Construction Team Services"
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--rc-white)]/60 to-[var(--rc-white)]" />
        </div>
      </div>

      <main className="relative z-10">
        <div className="relative z-10">
          
          {/* Main 6 Category Cards Grid */}
          <div className="pt-24 lg:pt-32 bg-transparent pb-10">
             <ServicesSection transparentBg />
          </div>

          {/* Interactive Category Deep-Dive Section */}
          <section className="container-rc pb-20 pt-6">
            <div className="bg-white rounded-[32px] border border-gray-200/80 shadow-xl overflow-hidden p-6 sm:p-10 md:p-12">
              
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-bold text-[var(--rc-orange)] uppercase tracking-widest px-3 py-1 rounded-full bg-orange-50 border border-orange-100 inline-block mb-3">
                  In-Depth Category Breakdown
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--rc-dark)]">
                  Explore What’s Inside Each Category
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Select any service below to review our execution steps, quality checks, and book a dedicated consultation.
                </p>
              </div>

              {/* Service Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide border-b border-gray-100">
                {servicesData.map((s) => {
                  const Icon = iconMap[s.iconName] || Home;
                  const isActive = s.id === selectedServiceId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-[var(--rc-dark)] text-white shadow-md shadow-slate-900/20"
                          : "bg-gray-100/80 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--rc-orange)]' : 'text-gray-500'}`} />
                      <span>{s.shortTitle}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Category Content Display */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column: Category Overview & Direct CTA */}
                <div className="lg:col-span-1 bg-gray-50/70 p-6 sm:p-8 rounded-3xl border border-gray-200/70 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--rc-orange)] text-white flex items-center justify-center mb-4 shadow-md shadow-orange-500/20">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--rc-orange)]">
                      Selected Category
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--rc-dark)] mt-1 mb-3">
                      {activeService.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {activeService.overview}
                    </p>

                    <div className="space-y-2 mb-8">
                      {activeService.highlights.map((h, i) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-200/50">
                          <span className="text-gray-500 font-medium">{h.label}:</span>
                          <span className="font-bold text-gray-800">{h.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setConsultService(activeService.title)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[var(--rc-orange)] hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Book {activeService.shortTitle} Consult
                    </button>

                    <Link
                      to={`/services/${activeService.slug}`}
                      className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      View Full Dedicated Page <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Columns: Steps & Quality Checks */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Steps Preview */}
                  <div>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-[var(--rc-dark)] mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--rc-orange)]" />
                      Execution Steps ({activeService.steps.length} Stages)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeService.steps.slice(0, 4).map((step, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-[var(--rc-orange)]">{step.number}</span>
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{step.duration}</span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{step.title}</h5>
                          <p className="text-[11px] text-gray-600 line-clamp-2">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Checks Preview */}
                  <div>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-[var(--rc-dark)] mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Key Quality & Technical Checks We Verify
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeService.checks.slice(0, 4).map((chk, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                            {chk.standard}
                          </span>
                          <h5 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{chk.title}</h5>
                          <p className="text-[11px] text-gray-600 line-clamp-2">{chk.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* USPs Preview */}
                  <div>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-[var(--rc-dark)] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--rc-blue)]" />
                      Key USPs We Offer
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeService.usps.map((u, idx) => (
                        <span key={idx} className="text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--rc-orange)]" />
                          <strong>{u.title}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* Construction Process Section */}
          <ConstructionProcess />
        </div>
      </main>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={!!consultService}
        onClose={() => setConsultService(null)}
        serviceName={consultService || activeService.title}
        defaultMessage={consultService ? `I would like to book a consultation for ${consultService}.` : ""}
      />
      
      <Footer />
    </div>
  );
}
