import { useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import SEO from "@/components/SEO";
import { servicesData as allServices } from "@/data/servicesData";
import ConsultationModal from "@/components/ConsultationModal";
import { ArrowRight, ArrowUpRight, Check, Home, Building2, Hammer, Paintbrush, Compass, HardHat } from "lucide-react";

const serviceOrder = ["residential-construction", "commercial-construction", "renovation", "interior-design", "architectural-design", "structural-engineering"];
const servicesData = [...allServices].sort((a, b) => serviceOrder.indexOf(a.id) - serviceOrder.indexOf(b.id));
const iconMap = { Home, Building2, Hammer, Paintbrush, Compass, HardHat };
const serviceImages = ["/images/services/residential.webp", "/images/services/commercial.webp", "/images/services/renovation.webp", "/images/services/interiors.webp", "/images/whyus_pricing.webp", "/images/whyus_quality.webp"];
const summaries = [
  "From an empty plot to a home built around your life.",
  "Practical, considered spaces for work, hospitality and business.",
  "A new chapter for the spaces you already know.",
  "Materials, light and everyday details, brought together.",
  "Layouts, elevations and drawings that turn ideas into a plan.",
  "Structural planning and checks to support your project.",
];
const phases = [
  { title: "Structure", image: "/villa_structural.webp", description: "Foundations, framing and the structural work that supports everything to come." },
  { title: "Services & enclosure", image: "/villa_rough.webp", description: "Walls, roofing and coordinated electrical, plumbing and building services." },
  { title: "Finishes & handover", image: "/villa_finished.webp", description: "Façades, interiors and final checks, bringing the complete space together." },
];

export default function Services() {
  const [selectedServiceId, setSelectedServiceId] = useState("residential-construction");
  const [consultService, setConsultService] = useState<string | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeService = servicesData.find(service => service.id === selectedServiceId) || servicesData[0];
  const activeIndex = servicesData.indexOf(activeService);
  const ActiveIcon = iconMap[activeService.iconName];
  return <div className="relative min-h-screen overflow-x-hidden bg-[#f8fafc]">
      <SEO
        title="Construction & Contractor Services in Gurgaon | Rupali Construction"
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
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f1f6ff_0%,#ffffff_55%,#dfeafb_100%)] pb-12 pt-28 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-40">
          <div className="container-rc">
            <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-[11px] text-[#71819a]"><Link to="/" className="hover:text-[var(--rc-blue)]">Home</Link><span aria-hidden="true">/</span><span className="text-[var(--rc-blue)]">Services</span></nav>
            <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
              <motion.div initial={reduceMotion ? false : {opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--rc-orange)]">From concept to completion</p>
                <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-[var(--rc-blue)] sm:text-7xl lg:text-[5.5rem]">One team.<br /><span className="italic">Every stage.</span></h1>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[#5b6c83] sm:text-base">Construction, interiors, renovation and engineering in Gurugram. Choose the support your space needs, with a clear path from planning to handover.</p>
                <div className="mt-7 flex flex-wrap items-center gap-3"><button type="button" onClick={()=>setConsultService(activeService.shortTitle)} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--rc-blue)] px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#17477e]">Discuss your project<ArrowUpRight className="h-4 w-4" /></button><a href="#all-services" className="inline-flex min-h-12 items-center gap-2 px-3 text-xs font-semibold text-[var(--rc-blue)]">Explore services<ArrowRight className="h-4 w-4" /></a></div>
              </motion.div>
              <div className="relative pb-5 pl-4 sm:pl-7">
                <div aria-hidden="true" className="absolute bottom-0 left-0 right-6 top-6 rounded-3xl border border-[var(--rc-blue)]/15" />
                <img src="/images/whyus_team.webp" alt="A team reviewing architectural drawings and coordinating a project" width="1000" height="800" className="relative aspect-[5/3] w-full rounded-3xl object-cover sm:aspect-[5/4]" />
                <div className="absolute bottom-0 left-0 rounded-2xl bg-[var(--rc-blue)] px-5 py-4 text-white shadow-lg shadow-blue-950/10 sm:px-7"><p className="text-[9px] uppercase tracking-[0.18em] text-[#b9d0f0]">Gurugram · Delhi NCR</p><p className="mt-1 font-serif text-xl sm:text-2xl">Plan. Build. Finish.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="all-services" aria-labelledby="services-heading" className="scroll-mt-24 py-12 sm:py-20">
          <div className="container-rc">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-10 md:flex-row md:items-end"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--rc-orange)]">Our expertise</p><h2 id="services-heading" className="font-serif text-3xl leading-tight text-[var(--rc-blue)] sm:text-5xl">The right support.<br /><span className="italic">For your next chapter.</span></h2></div><p className="max-w-xs text-sm leading-relaxed text-[#66758b]">Six areas of expertise, working together around your project.</p></div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {servicesData.map((service,index)=>{const Icon=iconMap[service.iconName];return <article key={service.id} className="group flex flex-col overflow-hidden rounded-2xl border border-[#dce5f1] bg-white sm:rounded-3xl">
                <Link to={`/services/${service.slug}`} className="relative block h-36 shrink-0 overflow-hidden sm:h-52"><img src={serviceImages[index]} alt={`Illustrative ${service.shortTitle.toLowerCase()} work`} width="900" height="600" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#082347]/45 to-transparent" /><span className="absolute left-3 top-3 font-mono text-[10px] text-white/90 sm:left-5 sm:top-5">0{index+1}</span><span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm"><Icon className="h-4 w-4" /></span></Link>
                <div className="flex flex-1 flex-col bg-[#edf3fc] p-3.5 sm:p-5"><h3 className="font-serif text-lg leading-tight text-[var(--rc-blue)] sm:text-2xl"><Link to={`/services/${service.slug}`}>{service.shortTitle}</Link></h3><p className="mt-2 text-xs leading-relaxed text-[#5b6c83] sm:text-sm">{summaries[index]}</p><div className="mt-auto pt-4"><a href="#service-details" onClick={()=>setSelectedServiceId(service.id)} className="inline-flex min-h-9 items-center gap-2 border-t border-[var(--rc-blue)]/10 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--rc-blue)] sm:text-xs">See our approach<ArrowUpRight className="h-3.5 w-3.5 shrink-0" /></a></div></div>
              </article>;})}
            </div>
          </div>
        </section>

        <section id="service-details" aria-labelledby="approach-heading" className="scroll-mt-24 bg-[#eaf1fb] py-12 sm:py-20">
          <div className="container-rc">
            <div className="mb-7"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--rc-orange)]">A closer look</p><h2 id="approach-heading" className="font-serif text-3xl text-[var(--rc-blue)] sm:text-5xl">Know what comes next.</h2><p className="mt-3 text-sm text-[#5b6c83]">Choose a service to explore the steps and checks behind the work.</p></div>
            <div role="group" aria-label="Choose a service to explore" className="mb-7 flex gap-2 overflow-x-auto pb-2">
              {servicesData.map(service=>{const Icon=iconMap[service.iconName];const selected=service.id===selectedServiceId;return <button key={service.id} type="button" aria-pressed={selected} onClick={()=>setSelectedServiceId(service.id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${selected ? "border-[var(--rc-blue)] bg-[var(--rc-blue)] text-white" : "border-[#cfdaeb] bg-white/80 text-[#5b6c83] hover:border-[var(--rc-blue)]"}`}><Icon className="h-3.5 w-3.5" />{service.shortTitle}</button>;})}
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.6fr] lg:gap-8">
              <div className="rounded-3xl bg-[var(--rc-blue)] p-6 text-white sm:p-8">
                <ActiveIcon className="mb-5 h-7 w-7 text-[#ffb17f]" /><h3 className="font-serif text-2xl sm:text-3xl">{activeService.shortTitle}</h3><p className="mt-4 text-sm leading-relaxed text-[#d0def0]">{summaries[activeIndex]}</p><p className="mt-4 text-sm leading-relaxed text-[#d0def0]">Discuss your scope, site conditions and material preferences with our team before the work begins.</p>
                <button type="button" onClick={()=>setConsultService(activeService.shortTitle)} className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-semibold text-[var(--rc-blue)]">Book a consultation<ArrowUpRight className="h-4 w-4" /></button><Link to={`/services/${activeService.slug}`} className="mt-4 flex min-h-11 items-center gap-2 text-xs font-medium text-white underline decoration-white/35 underline-offset-4">View full service details<ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
              <div><h4 className="mb-4 text-sm font-semibold text-[var(--rc-blue)]">How the work takes shape</h4><div className="grid gap-3 sm:grid-cols-2">{activeService.steps.slice(0,4).map(step=><div key={step.number} className="rounded-2xl border border-[#d6e1f1] bg-white p-5"><span className="font-mono text-[10px] text-[var(--rc-orange)]">{step.number}</span><h5 className="mt-2 text-sm font-semibold leading-snug text-[var(--rc-blue)]">{step.title}</h5><p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#66758b]">{step.desc}</p></div>)}</div>
                <div className="mt-5 rounded-2xl border border-[#d6e1f1] bg-white px-5 py-4"><h4 className="mb-3 text-sm font-semibold text-[var(--rc-blue)]">Checks along the way</h4><div className="space-y-3">{activeService.checks.slice(0,3).map(check=><div key={check.title} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--rc-orange)]" /><p className="text-xs leading-relaxed text-[#5b6c83]">{check.title}<span className="ml-2 text-[10px] text-[#8996a8]">{check.standard}</span></p></div>)}</div></div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="process-heading" className="py-12 sm:py-20">
          <div className="container-rc grid items-center gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--rc-orange)]">See the progression</p><h2 id="process-heading" className="font-serif text-3xl leading-tight text-[var(--rc-blue)] sm:text-5xl">From structure<br /><span className="italic">to a finished space.</span></h2><p className="mt-4 text-sm leading-relaxed text-[#66758b]">An illustrated look at three key stages of a build. Explore each stage at your own pace.</p><div role="group" aria-label="Construction stages" className="mt-6 space-y-2">{phases.map((phase,index)=><button key={phase.title} type="button" aria-pressed={phaseIndex===index} onClick={()=>setPhaseIndex(index)} className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${phaseIndex===index ? "border-[var(--rc-blue)] bg-[var(--rc-blue)] text-white" : "border-[#dce5f1] bg-white text-[#66758b]"}`}><span className="font-mono text-[10px] opacity-70">0{index+1}</span>{phase.title}<ArrowRight className="ml-auto h-4 w-4" /></button>)}</div></div>
            <figure className="overflow-hidden rounded-3xl border border-[#dce5f1] bg-white"><img src={phases[phaseIndex].image} alt={`Illustrative render of the ${phases[phaseIndex].title.toLowerCase()} stage`} width="1000" height="700" loading="lazy" className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]" /><figcaption className="p-5 sm:p-6"><p className="text-sm font-semibold text-[var(--rc-blue)]">{phases[phaseIndex].title}</p><p className="mt-2 text-xs leading-relaxed text-[#66758b] sm:text-sm">{phases[phaseIndex].description}</p></figcaption></figure>
          </div>
        </section>
        <section className="bg-[var(--rc-blue)] py-10 sm:py-14"><div className="container-rc flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb17f]">Let’s start with your idea</p><h2 className="font-serif text-3xl text-white sm:text-4xl">What are you planning to build?</h2></div><button type="button" onClick={()=>setConsultService(activeService.shortTitle)} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-semibold text-[var(--rc-blue)]">Talk to our team<ArrowUpRight className="h-4 w-4" /></button></div></section>
      </main>
      <ConsultationModal isOpen={!!consultService} onClose={()=>setConsultService(null)} serviceName={consultService || activeService.shortTitle} defaultMessage={consultService ? `I would like to discuss ${consultService.toLowerCase()} for my project.` : ""} />
      <Footer />
    </div>;
}
