import { useEffect, useRef } from "react";
import { trpc } from "@/providers/trpc";
import { MapPin, Maximize2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router";
import Image from "@/components/Image";

const filterOptions = ["all", "residential", "commercial", "renovation"] as const;

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFromUrl = searchParams.get("type");
  const activeFilter = typeFromUrl && (filterOptions as readonly string[]).includes(typeFromUrl) ? typeFromUrl : "all";

  const handleFilterClick = (filter: string) => {
    if (filter === "all") {
      setSearchParams(new URLSearchParams());
    } else {
      setSearchParams(new URLSearchParams({ type: filter }));
    }
  };

  const gridRef = useRef<HTMLDivElement>(null);

  const { data } = trpc.project.list.useQuery({
    type: activeFilter === "all" ? undefined : (activeFilter as "residential" | "commercial" | "renovation" | "interior"),
    limit: 50,
  });

  const projects = data?.items || [];

  useEffect(() => {
    const items = gridRef.current?.querySelectorAll(".project-card");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [projects]);

  const getProjectImage = (project: any) => {
    if (project.images) {
      const raw = project.images;
      if (typeof raw === "string") {
        if (raw.trim().startsWith("[") || raw.trim().startsWith("{")) {
          try {
            const imgs = JSON.parse(raw);
            if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
          } catch {}
        }
        const first = raw.split(",")[0]?.trim();
        if (first) return first;
      }
    }
    const fallback = fallbackProjects.find((p) => p.name === project.name || p.slug === project.slug);
    return fallback?.coverImage || undefined;
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-transparent relative overflow-x-clip overflow-y-visible z-20">
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none opacity-[0.03] -translate-x-1/4">
        <img
          src="/logo-icon.webp"
          alt=""
          className="w-full max-w-[800px] object-contain"
        />
      </div>
      <div className="container-rc relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <p className="text-5xl lg:text-[6rem] leading-none font-serif italic text-[var(--rc-orange)] mb-3 drop-shadow-sm">
              Portfolio
            </p>
            <h2 className="text-xl md:text-2xl font-medium text-[var(--rc-dark)]">
              Featured Projects
            </h2>
          </motion.div>

          <div className="flex gap-3 mt-8 justify-center flex-wrap">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-6 py-2.5 text-base font-medium rounded-full capitalize transition-all shadow-sm ${
                  activeFilter === filter
                    ? "bg-[var(--rc-orange)] text-white shadow-md shadow-[var(--rc-orange)]/20"
                    : "bg-white border border-[var(--rc-gray)] text-[var(--rc-muted)] hover:text-[var(--rc-orange)] hover:border-[var(--rc-orange)]/30 hover:bg-[var(--rc-orange)]/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Grid - hidden on mobile */}
        {/* Desktop Grid - hidden on mobile */}
        <div ref={gridRef} className="hidden md:flex md:flex-wrap justify-center gap-6">
          {projects.length > 0 ? (
            projects.map((project, i) => {
              const areaToShow = project.area || fallbackProjects.find(f => f.slug === project.slug)?.area;
              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="project-card group relative rounded-2xl overflow-hidden bg-[var(--rc-dark)] opacity-0 translate-y-6 block w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48.5px)/3)]"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--rc-dark)] via-transparent to-transparent z-10" />
                    <div className="w-full h-full bg-[var(--rc-blue)]/20 flex items-center justify-center">
                      <ProjectImage src={getProjectImage(project)} name={project.name} />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="text-label text-[var(--rc-orange)] mb-2 capitalize">
                      {project.type}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/60">
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {project.location}
                        </span>
                      )}
                      {areaToShow && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5" />
                          {areaToShow}
                        </span>
                      )}
                      {project.completionDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {project.completionDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[var(--rc-orange)]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                </Link>
              );
            })
          ) : (
            <>
              {fallbackProjects
                .filter(p => activeFilter === "all" || p.type === activeFilter)
                .map((project, i) => (
                <Link
                  key={project.name}
                  to={`/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="project-card group relative rounded-2xl overflow-hidden bg-[var(--rc-dark)] opacity-0 translate-y-6 block w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48.5px)/3)]"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--rc-dark)] via-transparent to-transparent z-10" />
                    <div className="w-full h-full bg-[var(--rc-blue)]/20 flex items-center justify-center">
                      <ProjectImage src={(project as any).coverImage} name={project.name} />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="text-label text-[var(--rc-orange)] mb-2 capitalize">
                      {project.type}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {project.name}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" />
                        {project.area}
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[var(--rc-orange)]/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                </Link>
              ))}
            </>
          )}
        </div>

        {/* Mobile 2-Column Grid - hidden on md+ */}
        <div className="md:hidden grid grid-cols-2 gap-2.5">
          {(projects.length > 0 ? projects : fallbackProjects.filter(p => activeFilter === "all" || p.type === activeFilter)).map((project: any, i: number, arr: any[]) => {
            const isLastOdd = i === arr.length - 1 && arr.length % 2 === 1;
            return (
              <motion.div
                key={project.id || project.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={isLastOdd ? "col-span-2 max-w-[260px] mx-auto w-full" : ""}
              >
              <Link
                to={`/projects/${project.slug || project.name?.toLowerCase().replace(/\s+/g, '-')}`}
                className="group block rounded-2xl overflow-hidden relative bg-[var(--rc-dark)] active:scale-[0.97] transition-transform"
              >
                {/* Image */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <ProjectImage 
                    src={getProjectImage(project)} 
                    name={project.name} 
                  />
                </div>

                {/* Overlay Content */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--rc-orange)] bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                    {project.type}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                  <h3 className="text-sm font-bold text-white leading-tight mb-1">
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/60">
                    {project.location && (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {project.location}
                      </span>
                    )}
                    {project.area && (
                      <span className="flex items-center gap-0.5">
                        <Maximize2 className="w-2.5 h-2.5" />
                        {project.area}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .project-card {
          will-change: transform, opacity;
          transform: translateZ(0);
        }
        .project-card.animate-in {
          opacity: 1;
          transform: translateY(0) translateZ(0);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
      `}</style>
    </section>
  );
}

function ProjectImage({ src, name }: { src?: string; name: string }) {
  if (src) {
    return (
      <Image 
        src={src} 
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
    );
  }
  return (
    <div className="text-center p-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--rc-blue)]/30 flex items-center justify-center">
        <span className="text-2xl font-bold text-white/60">
          {name.charAt(0)}
        </span>
      </div>
    </div>
  );
}

export const fallbackProjects = [
  { 
    id: 16,
    name: "QuickIn Stayz", 
    slug: "quickin-stayz",
    type: "commercial", 
    location: "Block - C, Sushant Lok 1, Sector 43, Gurugram", 
    area: "35,000 sq ft", 
    completionDate: "2024", 
    coverImage: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/f817e291-940c-43d3-a8af-b116265e6f2e.png",
    description: "Modern turnkey commercial hospitality and boutique suites located in Sushant Lok 1, Sector 43, Gurugram.",
    images: JSON.stringify([
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/f817e291-940c-43d3-a8af-b116265e6f2e.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/46c59bbb-6ca0-4e8e-88c0-77f5c6c72457.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/d21cff8b-8cdc-4434-9084-b2771c27065c.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/b92f87a0-bda8-4249-a016-4758727341a4.png"
    ])
  },
  { 
    id: 15,
    name: "Gold Gym", 
    slug: "gold-gym",
    type: "commercial", 
    location: "Sector 67, M3M URBANA, Gurgaon", 
    area: "11,000 sq ft", 
    completionDate: "2024", 
    coverImage: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/5416e429-298b-40a5-bd2b-cd8d4ce1c820.png",
    description: "State-of-the-art commercial fitness facility with heavy reinforced civil flooring, industrial acoustic isolation, and premium MEP systems at M3M Urbana, Sector 67, Gurgaon.",
    images: JSON.stringify([
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/5416e429-298b-40a5-bd2b-cd8d4ce1c820.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/ddc7209e-e9e0-4e97-85d7-c9159af57d86.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/ca6633e7-fc74-4a1c-8597-77caea430610.png"
    ])
  },
  { 
    id: 14,
    name: "Knowledge Center", 
    slug: "knowledge-center",
    type: "commercial", 
    location: "M3M Broadway, Sector 71, Gurugram", 
    area: "100,000 sq ft", 
    completionDate: "2024", 
    coverImage: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/7b1e9a0b-32c8-4e0b-9bbf-63b7b451ec68.png",
    description: "Iconic commercial landmark featuring corporate innovation suites, knowledge auditoriums, and cutting-edge civil infrastructure at M3M Broadway, Sector 71, Gurugram.",
    images: JSON.stringify([
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/7b1e9a0b-32c8-4e0b-9bbf-63b7b451ec68.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/2a4be811-3f5a-4333-b541-31a0d1febb6a.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/1d63ff4a-2d3f-4a08-a67a-88b52d7e3835.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/7ce868fb-a54d-47a0-ab7e-a1177bffa8a9.png"
    ])
  },
  { 
    id: 13,
    name: "Duplex Luxury Villa", 
    slug: "duplex-luxury-villa",
    type: "residential", 
    location: "The Westerlies, Sector 108, Gurugram", 
    area: "3,240 sq ft", 
    completionDate: "2024", 
    coverImage: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/a1d1885c-72d6-4bf5-9202-c8352529603d.jpg",
    description: "Turnkey luxury duplex villa crafted with modern architecture, premium structural engineering, and high-end finishes in The Westerlies, Sector 108, Gurugram.",
    images: JSON.stringify([
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/a1d1885c-72d6-4bf5-9202-c8352529603d.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/18cb134c-2857-42ca-9062-adfa6e03133b.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/39af469b-3bf4-4ba5-b029-63c6cfff7b7f.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/bd41909a-70a6-4571-8fcc-844e9065e56d.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/fae1e633-a9e8-4c0e-95da-76fceafc73ab.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/a4c7b3d2-5ed1-4300-b204-150c8d7f3bd7.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/82d52a40-0dd4-44fa-9d4c-2af02c4e0b94.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/f61a63bb-7da5-4c11-9186-ffaf9a844940.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/8fe1e5d5-58db-46e5-b592-4518e93000c6.jpg",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/c8281564-2aa9-4917-9bfa-c9a1b07ffa5c.jpg"
    ])
  },
  { 
    id: 12,
    name: "Apartment At Sushant Lok", 
    slug: "apartment-at-sushant-lok",
    type: "residential", 
    location: "Sushant Lok 1, Gurugram", 
    area: "1,800 sq ft", 
    completionDate: "2024", 
    coverImage: "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/9b0bd635-2175-4371-a8fc-50e7a50983db.png",
    description: "Premium residential apartment floor with bespoke interior craftsmanship and civil upgrades in Sushant Lok, Gurgaon.",
    images: JSON.stringify([
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/9b0bd635-2175-4371-a8fc-50e7a50983db.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/9c4aa831-9802-49d2-b325-201c5180e9b5.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/d64b78ee-73fa-4e68-a156-b7644edd3fb4.png",
      "https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/7d869794-8bde-43f8-9bb0-b9647ac7170b.png"
    ])
  }
];
