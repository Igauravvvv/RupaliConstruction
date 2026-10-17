import { useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { 
  getServiceBySlug, servicesData, ServiceDetailItem 
} from "@/data/servicesData";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";
import ConsultationModal from "@/components/ConsultationModal";
import { trpc } from "@/providers/trpc";
import { fallbackProjects } from "@/sections/Projects";
import Image from "@/components/Image";
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Clock, 
  Sparkles, Phone, ArrowRight, HelpCircle, ChevronRight,
  Layers, Hammer, Home, Building2, Paintbrush, Compass, HardHat
} from "lucide-react";

const iconMap = {
  Home,
  Building2,
  Hammer,
  Paintbrush,
  Compass,
  HardHat,
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const service = slug ? getServiceBySlug(slug) : undefined;

  // Fallback to first if slug is somehow empty, or 404
  if (!service) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <h1 className="text-3xl font-serif font-bold text-[var(--rc-dark)] mb-4 mt-20">
          Service Category Not Found
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          The requested service category could not be located. Browse our complete suite of construction and architectural services.
        </p>
        <Link 
          to="/services" 
          className="px-6 py-3 rounded-xl bg-[var(--rc-blue)] text-white font-medium hover:bg-blue-900 transition-colors"
        >
          View All Services
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[service.iconName] || Home;

  // Fetch relevant portfolio projects matching this category
  const { data: dbProjects } = trpc.project.list.useQuery({
    type: service.projectTypeFilter,
    limit: 3,
  });

  const matchingProjects = (dbProjects && dbProjects.length > 0) 
    ? dbProjects 
    : fallbackProjects.filter(p => !service.projectTypeFilter || p.type.toLowerCase() === service.projectTypeFilter).slice(0, 3);

  const whatsappUrl = `https://wa.me/919311830088?text=${encodeURIComponent(service.consultationCTA.whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[var(--rc-orange)]/20 selection:text-[var(--rc-dark)]">
      <SEO
        title={`${service.title} | Rupali Construction Gurgaon`}
        description={service.overview}
        keywords={`${service.shortTitle} Gurgaon, ${service.title}, construction DLF Sushant Lok, best ${service.shortTitle} contractor Gurgaon, Rupali Construction`}
        image={service.heroImage}
        url={`/services/${service.slug}`}
        type="article"
      />
      <Navbar />

      <main className="pt-28 pb-20">
        
        {/* Navigation Breadcrumb */}
        <div className="container-rc mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
            <Link to="/" className="hover:text-[var(--rc-dark)] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-[var(--rc-dark)] transition-colors">Services</Link>
            <span>/</span>
            <span className="text-[var(--rc-orange)] font-semibold">{service.shortTitle}</span>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="container-rc mb-16">
          <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-10 md:p-14 lg:p-16 shadow-2xl border border-slate-800">
            {/* Ambient Background Glow & Image Overlay */}
            <div className="absolute right-0 top-0 w-full md:w-3/5 h-full opacity-20 md:opacity-30 pointer-events-none mix-blend-luminosity overflow-hidden">
              <img 
                src={service.heroImage} 
                alt={service.title} 
                className="w-full h-full object-cover object-center scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/70 to-transparent" />
            </div>

            <div className="relative z-10 max-w-3xl">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[var(--rc-orange)] mb-6 shadow-sm">
                <IconComponent className="w-4 h-4 text-[var(--rc-orange)]" />
                <span>Specialized Service Category</span>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-4 leading-[1.15]">
                {service.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light mb-8 max-w-2xl leading-relaxed">
                {service.tagline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => setIsConsultOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-[var(--rc-orange)] hover:bg-orange-600 active:scale-95 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-orange-500/25 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  {service.consultationCTA.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 active:scale-95 text-white font-semibold text-sm sm:text-base flex items-center gap-2.5 transition-all"
                >
                  <svg className="w-4 h-4 fill-emerald-400" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Highlights Metric Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                {service.highlights.map((h, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/5">
                    <p className="text-xl sm:text-2xl font-bold font-serif text-white">{h.value}</p>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">{h.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="container-rc mb-20">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm max-w-4xl mx-auto">
            <span className="text-xs font-bold text-[var(--rc-orange)] uppercase tracking-wider block mb-2">
              Scope of Service & Capability
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--rc-dark)] mb-4">
              Engineered with Passion, Delivered with Integrity
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              {service.overview}
            </p>
          </div>
        </div>

        {/* Section 1: How We Do It (Step-by-Step Execution Process) */}
        <section className="container-rc mb-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[var(--rc-blue)] uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 border border-blue-100 inline-block mb-3">
              Execution Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--rc-dark)] tracking-tight mb-4">
              How We Execute: Step-by-Step
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Every phase is engineered with strict civil milestones, quality sign-offs, and complete client visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.steps.map((step, idx) => (
              <div 
                key={idx}
                className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 hover:border-[var(--rc-orange)]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[var(--rc-orange)]">
                      {step.number}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      <Clock className="w-3 h-3 text-[var(--rc-orange)]" />
                      {step.duration}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--rc-dark)] mb-3 group-hover:text-[var(--rc-orange)] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Key Deliverables:
                  </p>
                  <ul className="space-y-1.5">
                    {step.deliverables.map((d, dIdx) => (
                      <li key={dIdx} className="text-xs text-gray-700 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Key Features & Quality Checks We Inspect */}
        <section className="bg-slate-900 text-white py-20 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--rc-orange)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container-rc relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold text-[var(--rc-orange)] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 border border-white/15 inline-block mb-3">
                Quality Verification Standards
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
                Key Technical Checks We Inspect
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                We perform non-negotiable engineering tests adhering strictly to Indian Standard (IS) codes and German construction tolerances.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.checks.map((chk, idx) => (
                <div 
                  key={idx}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-[var(--rc-orange)]/50 transition-all hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-[var(--rc-orange)] shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                      {chk.standard}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-serif">
                    {chk.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                    {chk.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Why Rupali Construction (Our USPs) */}
        <section className="container-rc mb-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[var(--rc-orange)] uppercase tracking-widest px-3 py-1 rounded-full bg-orange-50 border border-orange-100 inline-block mb-3">
              The Rupali Guarantee
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--rc-dark)] tracking-tight mb-4">
              Our Unmatched USPs
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Why discerning homeowners and business leaders in Gurgaon trust Rupali Construction for their landmark assets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.usps.map((usp, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-gray-200/80 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {usp.badge && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--rc-orange)]/10 text-[var(--rc-orange)] mb-3">
                      {usp.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-serif font-bold text-[var(--rc-dark)] mb-2.5">
                    {usp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {usp.desc}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[var(--rc-blue)]">
                  <span>Guaranteed by Rupali</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Featured Portfolio Projects in this Category */}
        {matchingProjects.length > 0 && (
          <section className="container-rc mb-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-[var(--rc-blue)] uppercase tracking-wider block mb-1">
                  Track Record
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--rc-dark)]">
                  Recent Work in {service.shortTitle}
                </h2>
              </div>
              <Link 
                to={`/projects?type=${service.projectTypeFilter}`}
                className="text-sm font-bold text-[var(--rc-blue)] hover:text-[var(--rc-orange)] flex items-center gap-1.5 transition-colors"
              >
                View All {service.shortTitle} Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchingProjects.map((p) => {
                let coverImg = p.coverImage || "";
                if (!coverImg && (p as any).images) {
                  try {
                    const parsed = JSON.parse((p as any).images);
                    coverImg = parsed[0] || "";
                  } catch {
                    coverImg = (p as any).images.split(",")[0] || "";
                  }
                }
                const slugToUse = p.slug || p.name.toLowerCase().replace(/\s+/g, '-');

                return (
                  <Link
                    key={p.id}
                    to={`/projects/${slugToUse}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="h-56 sm:h-64 overflow-hidden relative">
                      <Image
                        src={coverImg || service.heroImage}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[var(--rc-dark)] shadow-sm">
                        {p.location || "Gurugram"}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-[var(--rc-dark)] group-hover:text-[var(--rc-orange)] transition-colors mb-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">{p.area || "Luxury Residence"}</p>
                      </div>
                      <span className="text-xs font-semibold text-[var(--rc-blue)] flex items-center gap-1">
                        Explore Project Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 5: FAQs */}
        <section className="container-rc mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[var(--rc-orange)] uppercase tracking-wider block mb-2">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--rc-dark)]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {service.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-[var(--rc-dark)] hover:text-[var(--rc-orange)] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight 
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90 text-[var(--rc-orange)]' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Direct Consultation Call to Action Banner */}
        <div className="container-rc">
          <div className="rounded-[32px] bg-gradient-to-r from-[var(--rc-blue)] to-[#0A1E3F] text-white p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[var(--rc-orange)]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-[var(--rc-orange)] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 inline-block mb-3">
                Let's Build Together
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                Ready to Discuss Your {service.shortTitle}?
              </h2>
              <p className="text-sm sm:text-base text-gray-200 mb-8 font-light">
                {service.consultationCTA.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsConsultOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[var(--rc-orange)] hover:bg-orange-600 active:scale-95 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  {service.consultationCTA.buttonText}
                </button>

                <a
                  href="tel:+919311830088"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 active:scale-95 text-white font-semibold text-base flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-5 h-5 text-gray-200" />
                  Call: +91 93118 30088
                </a>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Consultation Modal */}
      <ConsultationModal 
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
        serviceName={service.title}
        defaultMessage={`I would like to book a consultancy for ${service.title} in Gurgaon.`}
      />

      <Footer />
    </div>
  );
}
