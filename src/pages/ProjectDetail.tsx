import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { 
  ArrowLeft, Maximize2, MapPin, Heart, Flame, Share2, 
  Bed, Bath, Grid2X2, Layers 
} from "lucide-react";
import { fallbackProjects } from "@/sections/Projects";
import HouseAnimation from "@/components/HouseAnimation";
import Image from "@/components/Image";

export default function ProjectDetail() {
  const { slug } = useParams();
  
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
    cost: "₹5,50,00,000",
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

  const images = activeProject.images ? JSON.parse(activeProject.images) : [];
  const mainImage = images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80";
  const secondImage = images[1] || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80";
  
  // Parse numeric values out of area or use fallbacks for UI demonstration
  const parsedArea = activeProject.area ? activeProject.area.replace(/[^0-9]/g, "") : "2945";

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Navbar />

      <main className="container-rc pt-28 pb-20">
        
        {/* Back Link */}
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--rc-dark)] mb-4 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Split Image Gallery */}
        <div className="grid grid-cols-2 gap-2 h-[400px] md:h-[500px] lg:h-[550px] rounded-[32px] overflow-hidden mb-8 shadow-sm">
          <div className="w-full h-full">
            <Image src={mainImage} alt={activeProject.name} className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-full relative">
            <Image src={secondImage} alt={activeProject.name} className="w-full h-full object-cover" />
            <button className="absolute bottom-6 right-6 bg-white/95 backdrop-blur px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium text-sm text-[var(--rc-dark)] hover:bg-white shadow-lg transition-all active:scale-95">
              <Maximize2 className="w-4 h-4" />
              Show all {images.length > 2 ? images.length : 2} photos
            </button>
          </div>
        </div>

        {/* Header Information Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-gray-200 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.8)]" />
              AVAILABLE
              <span className="text-gray-400 font-normal border-l border-gray-300 pl-2 ml-1 capitalize">Sale</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight mb-3 font-serif">
              {activeProject.cost || "₹6,00,00,000"}
            </h1>
            
            <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
              <MapPin className="w-4 h-4 text-gray-400" />
              {activeProject.location || "Sec-66 (Golf Course Extn. Road)"}
            </div>
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
                  <Bed className="w-7 h-7 text-gray-400 mb-3" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-[#0F172A]">3</span>
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-1">Beds</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <Bath className="w-7 h-7 text-gray-400 mb-3" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-[#0F172A]">3</span>
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-1">Baths</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <Maximize2 className="w-7 h-7 text-gray-400 mb-3" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-[#0F172A]">{parsedArea}</span>
                  <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase mt-1">Sqft</span>
                </div>
              </div>
            </div>

            {/* About this home */}
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-6">About this home</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: activeProject.description || `
                  <p>An ultra-luxury residential project located in prime Gurugram, offering premium apartments. Designed by world-renowned architects, the development features twin towers rising majestically on a land parcel of 10+ acres.</p>
                  <p>The project emphasizes high-end amenities including a rooftop infinity edge swimming pool, private jacuzzis, private decks, and a comprehensive club with facilities like a private theatre, spa, squash court, beach park, and sports bar.</p>
                  <p>Experience the pinnacle of luxury living with this exquisite property. Featuring state-of-the-art amenities, premium finishes, and a location that offers both privacy and connectivity.</p>
                  ` 
                }} 
              />
            </div>

            {/* What this property offers */}
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-8">What this property offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="flex items-center gap-4 text-gray-700">
                  <Grid2X2 className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                  <span className="text-lg">Carpet Area: {parsedArea} sq.ft</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <Layers className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                  <span className="text-lg">Tiles Flooring</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-6 h-6 rounded flex items-center justify-center border border-gray-400">
                    <div className="w-3 h-3 bg-gray-400 rounded-sm" />
                  </div>
                  <span className="text-lg">Smart Home Automation</span>
                </div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />
                  <span className="text-lg">Central AC</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Sticky Animation */}
          <div className="lg:col-span-4 hidden lg:block">
            <HouseAnimation />
          </div>
        </div>

        {/* Cost Breakdown Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Project Cost Breakdown</h2>
            <p className="text-gray-500 mb-8 text-lg">A detailed analysis of how we calculated the {activeProject.cost || "₹6,00,00,000"} investment for this premium construction.</p>
            
            <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between p-6 md:px-8 hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-lg">Core Construction</h4>
                    <p className="text-sm text-gray-500 mt-1">Foundation, structural framing, roofing, exterior walls.</p>
                  </div>
                  <div className="text-xl font-bold text-gray-800">45%</div>
                </div>
                <div className="flex items-center justify-between p-6 md:px-8 hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-lg">Premium Materials & Finishes</h4>
                    <p className="text-sm text-gray-500 mt-1">Italian marble, custom millwork, high-end fixtures.</p>
                  </div>
                  <div className="text-xl font-bold text-gray-800">30%</div>
                </div>
                <div className="flex items-center justify-between p-6 md:px-8 hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-lg">Smart Systems & Utilities</h4>
                    <p className="text-sm text-gray-500 mt-1">HVAC, smart home automation, plumbing, electrical.</p>
                  </div>
                  <div className="text-xl font-bold text-gray-800">15%</div>
                </div>
                <div className="flex items-center justify-between p-6 md:px-8 hover:bg-gray-50 transition-colors bg-gray-50/50">
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-lg">Design & Permits</h4>
                    <p className="text-sm text-gray-500 mt-1">Architectural fees, city permits, engineering approvals.</p>
                  </div>
                  <div className="text-xl font-bold text-gray-800">10%</div>
                </div>
              </div>
              <div className="bg-[#0F172A] p-6 md:px-8 flex items-center justify-between text-white">
                <span className="font-medium text-lg">Total Project Cost</span>
                <span className="text-3xl font-bold">{activeProject.cost || "₹6,00,00,000"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-[var(--rc-blue)] to-[#09358A] rounded-[32px] p-10 md:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold mb-4 font-serif">Want a custom home like this?</h2>
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
              const opImages = op.images ? JSON.parse(op.images) : [];
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
                    <div className="text-[#0F172A] font-bold">
                      {op.cost || "Price on Request"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
