import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { 
  ArrowLeft, Maximize2, MapPin, Heart, Flame, Share2,
  Grid2X2, Layers, X, Instagram, Quote
} from "lucide-react";
import { fallbackProjects } from "@/sections/Projects";
import HouseAnimation from "@/components/HouseAnimation";
import Image from "@/components/Image";
import SEO from "@/components/SEO";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (isGalleryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isGalleryOpen]);
  
  // Use suspense or handle loading state gracefully
  const { data: dbProject, isLoading } = trpc.project.bySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Fetch some "Other Properties"
  const { data: otherProjects } = trpc.project.list.useQuery({ limit: 3 });

  // Attempt to find a fallback project if DB returns null or is loading
  const fallbackMatch = fallbackProjects.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (isLoading && !fallbackMatch) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--rc-blue)] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ... fallback match extracted above ...

  const activeProject = dbProject || (fallbackMatch ? {
    id: 0,
    name: fallbackMatch.name,
    slug: slug || "",
    description: "",
    location: fallbackMatch.location,
    area: fallbackMatch.area,
    duration: "18 Months",
    type: fallbackMatch.type,
    status: "completed",
    images: JSON.stringify([fallbackMatch.coverImage]),
    featured: false,
    completionDate: fallbackMatch.completionDate,
    reviewerName: "",
    reviewerRole: "",
    reviewText: "",
    instagramVideoUrl: "",
    processSteps: "",
    createdAt: new Date(),
  } as any : null);

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-[var(--rc-dark)]">Project not found</h1>
      </div>
    );
  }

  let images: string[] = [];
  try {
    images = activeProject.images ? JSON.parse(activeProject.images) : [];
  } catch (e) {
    images = activeProject.images ? activeProject.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
  }
  const mainImage = images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80";
  const secondImage = images[1] || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80";
  
  // Parse numeric values out of area or use fallbacks for UI demonstration
  const parsedArea = activeProject.area ? activeProject.area.replace(/[^0-9]/g, "") : "2945";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <SEO 
        title={`${activeProject.name} | Luxury Villa Project Gurgaon | Rupali Construction`}
        description={activeProject.description || `Explore ${activeProject.name}, a luxury ${activeProject.type || 'residential'} architectural project in ${activeProject.location || 'Gurgaon'}, built by Rupali Construction with uncompromised quality and aesthetics.`}
        keywords={`${activeProject.name}, ${activeProject.location || 'Gurgaon'} construction, residential project Gurgaon, luxury custom villa Gurgaon, architecture Sector 71`}
        image={mainImage}
        url={`/projects/${activeProject.slug || slug}`}
        type="article"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Residence",
            "name": activeProject.name,
            "description": activeProject.description || `Luxury villa project built in ${activeProject.location || 'Gurgaon'}.`,
            "image": images.length > 0 ? images : [mainImage],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": activeProject.location || "Gurugram",
              "addressRegion": "Haryana",
              "addressCountry": "IN"
            }
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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": activeProject.name,
                "item": `https://rupaliconstruction.com/projects/${activeProject.slug || slug}`
              }
            ]
          }
        ]}
      />
      <Navbar />

      <main className="container-rc pt-28 pb-20">
        
        {/* Back Link */}
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--rc-dark)] mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Project Title Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-2 font-serif">
            {activeProject.name}
          </h1>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
            <MapPin className="w-4 h-4 text-gray-400" />
            {activeProject.location || "Sec-66 (Golf Course Extn. Road)"}
          </div>
        </div>

        {/* Split Image Gallery */}
        <div className="grid grid-cols-2 gap-2 h-[400px] md:h-[500px] lg:h-[550px] rounded-[32px] overflow-hidden mb-8 shadow-sm">
          <div className="w-full h-full">
            <Image src={mainImage} alt={activeProject.name} className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-full relative cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
            <Image src={secondImage} alt={activeProject.name} className="w-full h-full object-cover" />
            <button 
              onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
              className="absolute bottom-6 right-6 bg-white/95 backdrop-blur px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium text-sm text-[var(--rc-dark)] hover:bg-white shadow-lg transition-all active:scale-95"
            >
              <Maximize2 className="w-4 h-4" />
              Show all {images.length > 2 ? images.length : 2} photos
            </button>
          </div>
        </div>

        {/* Header Information Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-gray-200 pb-8">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-600 uppercase">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(5,150,105,0.8)] ${activeProject.status === "ongoing" ? "bg-amber-500" : "bg-emerald-600"}`} />
            {activeProject.status === "ongoing" ? "Ongoing project" : "Completed project"}
          </div>

          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full border border-orange-200 bg-orange-50 flex items-center justify-center text-orange-500 hover:border-orange-300 hover:bg-orange-100 transition-colors shadow-sm">
              <Flame className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Stats Bar */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-8 shadow-sm">
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <Grid2X2 className="w-7 h-7 text-gray-400 mb-3" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-[#0F172A] capitalize">{activeProject.type || "Project"}</span>
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-1">Type</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <Layers className="w-7 h-7 text-gray-400 mb-3" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-[#0F172A] capitalize">{activeProject.status || "Completed"}</span>
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-1">Status</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <Maximize2 className="w-7 h-7 text-gray-400 mb-3" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-[#0F172A]">{parsedArea}</span>
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-1">Sqft</span>
                </div>
              </div>
            </div>

            {/* About this project */}
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">About this {activeProject.type === 'residential' ? 'home' : 'project'}</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: activeProject.description || `
                  <p>A beautifully executed ${activeProject.type || 'construction'} project located in ${activeProject.location || 'a prime location'}. Designed and developed with utmost attention to detail and modern architecture.</p>
                  <p>Our team at Rupali Construction ensured the highest quality standards, resulting in a robust, aesthetically pleasing, and highly functional space.</p>
                  ` 
                }} 
              />
            </div>

            {/* What this property offers */}
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Project Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="flex items-center gap-4 text-gray-700">
                  <Grid2X2 className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                  <span className="text-lg">Carpet Area: {parsedArea} sq.ft</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <MapPin className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                  <span className="text-lg">Location: {activeProject.location || "N/A"}</span>
                </div>
                {activeProject.duration && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <Layers className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                    <span className="text-lg">Duration: {activeProject.duration}</span>
                  </div>
                )}
                {activeProject.completionDate && (
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    </div>
                    <span className="text-lg">Completed: {activeProject.completionDate}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar - Sticky Animation */}
          <div className="lg:col-span-4 hidden lg:block">
            <HouseAnimation />
          </div>
        </div>

        {(activeProject.reviewText || activeProject.instagramVideoUrl) && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Client review</h2>
                <p className="text-gray-500 text-lg">Hear directly from the people we built this project for.</p>
              </div>
              {activeProject.reviewText && (
                <figure className="bg-white border border-gray-200 rounded-[24px] p-8 md:p-10 shadow-sm">
                  <Quote className="w-9 h-9 text-[var(--rc-orange)] mb-5" strokeWidth={1.5} />
                  <blockquote className="text-xl md:text-2xl leading-relaxed text-[#0F172A] font-serif">“{activeProject.reviewText}”</blockquote>
                  {(activeProject.reviewerName || activeProject.reviewerRole) && (
                    <figcaption className="mt-6 text-sm">
                      {activeProject.reviewerName && <p className="font-bold text-[#0F172A]">{activeProject.reviewerName}</p>}
                      {activeProject.reviewerRole && <p className="text-gray-500 mt-1">{activeProject.reviewerRole}</p>}
                    </figcaption>
                  )}
                </figure>
              )}
              {activeProject.instagramVideoUrl && (
                <a
                  href={activeProject.instagramVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] px-6 py-4 font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Instagram className="w-5 h-5" />
                  Watch the client testimonial on Instagram
                </a>
              )}
            </div>
          </section>
        )}

        {/* Custom CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-[var(--rc-blue)] to-[#09358A] rounded-[32px] p-10 md:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold mb-4 font-serif">Want a custom {activeProject.type === 'residential' ? 'home' : 'project'} like this?</h2>
            <p className="text-white/80 text-xl mb-10 leading-relaxed">
              Every project is unique. Get a personalized estimate for a construction customized to your exact requirements and lifestyle.
            </p>
            <Link 
              to="/#estimate" 
              className="inline-flex items-center justify-center px-10 py-5 bg-[var(--rc-orange)] text-white text-lg font-bold rounded-full hover:scale-105 hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)] transition-all active:scale-95"
            >
              Calculate Custom Estimate
            </Link>
          </div>
        </div>

        {/* Other Properties Section */}
        <div className="mt-24 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8">Other Properties</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(otherProjects?.items || []).slice(0, 3).map((op) => {
              let opImages: string[] = [];
              try {
                opImages = op.images ? JSON.parse(op.images) : [];
              } catch (e) {
                opImages = op.images ? op.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
              }
              const opCover = opImages[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80";
              
              return (
                <Link 
                  key={op.id} 
                  to={`/projects/${op.slug}`}
                  className="bg-white rounded-[24px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group block"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image 
                      src={opCover} 
                      alt={op.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-[#0F172A] mb-1 truncate">{op.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 truncate">{op.location}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
      
      <Footer />

      {/* Image Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" data-lenis-prevent="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsGalleryOpen(false)} />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 px-6 flex justify-between items-center border-b border-gray-200 bg-white z-10">
              <h2 className="text-xl md:text-2xl font-bold font-serif text-[#0F172A]">{activeProject.name} - Gallery</h2>
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 md:p-6 bg-gray-100 flex-1" data-lenis-prevent="true">
              <div className="flex flex-col gap-6">
                {(images.length > 0 ? images : [mainImage, secondImage]).map((img: string, idx: number) => (
                  <div key={idx} className="w-full rounded-xl overflow-hidden shadow-sm bg-white">
                    <Image src={img} alt={`${activeProject.name} photo ${idx + 1}`} className="w-full h-auto max-h-[75vh] object-contain mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
