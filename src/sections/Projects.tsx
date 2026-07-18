import { useEffect, useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import { MapPin, Maximize2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import Image from "@/components/Image";

const filterOptions = ["all", "residential", "commercial", "renovation"] as const;

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const { data } = trpc.project.list.useQuery({
    type: activeFilter === "all" ? undefined : (activeFilter as "residential" | "commercial" | "renovation" | "interior"),
    limit: 8,
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
      try {
        const imgs = JSON.parse(project.images);
        if (imgs.length > 0) return imgs[0];
      } catch {
        return project.images.split(",")[0];
      }
    }
    const fallback = fallbackProjects.find((p) => p.name === project.name);
    return fallback?.coverImage || undefined;
  };

  return (
    <section className="py-24 lg:py-32 bg-[var(--rc-white)] relative overflow-x-clip overflow-y-visible z-20">
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none opacity-[0.03] -translate-x-1/4">
        <img
          src="/logo-icon.png"
          alt=""
          className="w-full max-w-[800px] object-contain"
        />
      </div>
      <div className="container-rc relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: "-50vw" }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
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
                onClick={() => setActiveFilter(filter)}
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

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project, i) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="project-card group relative rounded-2xl overflow-hidden bg-[var(--rc-dark)] opacity-0 translate-y-6 block"
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
                    {project.area && (
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" />
                        {project.area}
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
            ))
          ) : (
            <>
              {fallbackProjects
                .filter(p => activeFilter === "all" || p.type === activeFilter)
                .map((project, i) => (
                <Link
                  key={project.name}
                  to={`/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="project-card group relative rounded-2xl overflow-hidden bg-[var(--rc-dark)] opacity-0 translate-y-6 block"
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
      </div>

      <style>{`
        .project-card.animate-in {
          opacity: 1;
          transform: translateY(0);
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
  { name: "The Sapphire", type: "residential", location: "Sector 62, Gurgaon", area: "45,000 sq ft", completionDate: "2024", coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" },
  { name: "Skyline Tower", type: "commercial", location: "Cyber City, Gurgaon", area: "1,20,000 sq ft", completionDate: "2023", coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" },
  { name: "Rupali Villas", type: "residential", location: "DLF Phase 5, Gurgaon", area: "85,000 sq ft", completionDate: "2024", coverImage: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80" },
  { name: "NCR Business Park", type: "commercial", location: "Noida Sector 136", area: "2,50,000 sq ft", completionDate: "2023", coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80" },
  { name: "Heritage Homes", type: "renovation", location: "Sushant Lok, Gurgaon", area: "12,000 sq ft", completionDate: "2024", coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" },
  { name: "Green Valley Estate", type: "residential", location: "Sohna Road, Gurgaon", area: "1,80,000 sq ft", completionDate: "2025", coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" },
  { name: "Oasis Apartments", type: "residential", location: "Golf Course Ext", area: "1,10,000 sq ft", completionDate: "2025", coverImage: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80" },
  { name: "Tech Hub Tower", type: "commercial", location: "Udyog Vihar", area: "3,00,000 sq ft", completionDate: "2026", coverImage: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&q=80" },
  { name: "Pinecrest Villas", type: "residential", location: "Sector 54, Gurgaon", area: "95,000 sq ft", completionDate: "2024", coverImage: "https://images.unsplash.com/photo-1613490908574-4bf8765ff9c3?auto=format&fit=crop&q=80" },
];
