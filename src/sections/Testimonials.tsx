import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { Building2, Dumbbell, GraduationCap, Hotel, Star, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const { data } = trpc.testimonial.list.useQuery({ limit: 12 });
  const testimonials = data && data.length > 0 ? data : fallbackTestimonials;

  const defaultAvatars = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  ];

  const mappedTestimonials = testimonials.map((t: any, i: number) => ({
    author: {
      name: t.name,
      handle: t.location || "Verified Client",
      avatar: t.avatar || defaultAvatars[i % defaultAvatars.length]
    },
    text: t.content
  }));

  return (
    <section className="py-24 lg:py-32 bg-[var(--rc-gray)] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-[0.03] translate-x-1/4">
        <img
          src="/logo-icon.webp"
          alt=""
          className="w-full max-w-[800px] object-contain"
        />
      </div>

      <div className="mx-auto flex w-full flex-col items-center gap-4 text-center sm:gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 px-4 sm:gap-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-6xl lg:text-[7rem] leading-none font-serif italic text-[var(--rc-orange)] mb-2 drop-shadow-sm"
          >
            Testimonials
          </motion.p>
          <h2 className="max-w-[720px] text-xl md:text-2xl font-medium text-[var(--rc-dark)]">
            What Our Clients & Commercial Partners Say
          </h2>
          <p className="text-md max-w-[650px] font-medium text-muted-foreground sm:text-lg">
            Trusted by over 550+ luxury homeowners and esteemed commercial landmark developers across Gurgaon.
          </p>

          {/* Featured Commercial Clients Badge Bar (Gold's Gym, Knowledge Centre, Quick & Stays Hotel) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl px-2">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:border-[var(--rc-orange)]/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[var(--rc-dark)] leading-tight">Gold's Gym</p>
                <p className="text-[10px] text-gray-500">Commercial Fitness Landmark</p>
              </div>
              <span className="text-[10px] font-bold text-amber-500 flex items-center ml-1">★ 5.0</span>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:border-[var(--rc-orange)]/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-[var(--rc-blue)] shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[var(--rc-dark)] leading-tight">Knowledge Centre</p>
                <p className="text-[10px] text-gray-500">Corporate Innovation Hub</p>
              </div>
              <span className="text-[10px] font-bold text-amber-500 flex items-center ml-1">★ 5.0</span>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:border-[var(--rc-orange)]/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <Hotel className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[var(--rc-dark)] leading-tight">Quick & Stays Hotel</p>
                <p className="text-[10px] text-gray-500">Commercial Hospitality</p>
              </div>
              <span className="text-[10px] font-bold text-amber-500 flex items-center ml-1">★ 5.0</span>
            </div>
          </div>
        </motion.div>

        {/* Marquee Carousel of Testimonials */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
          <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row [--duration:30s]">
            {/* First Set */}
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee will-change-transform flex-row group-hover:[animation-play-state:paused]">
              {mappedTestimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={`set1-${i}`}
                  {...testimonial}
                />
              ))}
            </div>

            {/* Second Set (identical duplicate for seamless loop) */}
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee will-change-transform flex-row group-hover:[animation-play-state:paused]" aria-hidden="true">
              {mappedTestimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={`set2-${i}`}
                  {...testimonial}
                />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-[var(--rc-gray)] sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-l from-[var(--rc-gray)] sm:block" />
        </div>
      </div>
    </section>
  );
}

export const fallbackTestimonials = [
  {
    name: "Gold's Gym Management",
    location: "Golf Course Road, Gurgaon",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&q=80",
    content: "Rupali Construction engineered and constructed our flagship Gold's Gym facility with exceptional high-load floor capacities, vibration damping for heavy weights, and advanced ventilation. Delivered on schedule with immaculate structural precision.",
  },
  {
    name: "Knowledge Centre Corporate Director",
    location: "Sector 44, Gurgaon",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop&q=80",
    content: "Building the Knowledge Centre required complex large-span acoustic auditoriums and smart HVAC automation. Rupali Construction's engineering rigor and institutional quality standards exceeded all expectations.",
  },
  {
    name: "Quick & Stays Hospitality Group",
    location: "Sushant Lok 1, Sector 43, Gurgaon",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&h=150&fit=crop&q=80",
    content: "From core RCC structure to luxury guest room finishes, Quick & Stays Hotel was delivered ahead of schedule with 0% cost overruns. Their turnkey execution and adherence to fire & safety norms was flawless.",
  },
  {
    name: "Rajesh Sharma",
    location: "Sector 45, Gurgaon",
    rating: 5,
    content: "Rupali Construction delivered our dream home exactly as promised. The quality of work, transparency in billing, and on-time delivery exceeded our expectations. Highly recommended for anyone looking to build in Gurgaon.",
  },
  {
    name: "Priya Malhotra",
    location: "DLF Phase 2, Gurgaon",
    rating: 5,
    content: "We hired them for a complete renovation of our 15-year-old villa. The transformation was incredible. Their team handled everything from structural changes to interior finishing with utmost professionalism.",
  },
  {
    name: "Amit Gupta",
    location: "Cyber Hub, Gurgaon",
    rating: 5,
    content: "For our commercial office space, Rupali Construction delivered a world-class facility. The project management was excellent, and the live tracking feature kept us updated throughout the construction process.",
  },
  {
    name: "Neha Desai",
    location: "Sector 57, Gurgaon",
    rating: 5,
    content: "Absolutely thrilled with our new apartment interior! The team understood our vision perfectly and executed it with incredible attention to detail. The craftsmanship is top-notch.",
  },
  {
    name: "Vikram Singh",
    location: "Sohna Road, Gurgaon",
    rating: 5,
    content: "Building our first house was daunting, but Rupali Construction made it seamless. From architectural planning to final handover, their expertise shone through. Thank you for our beautiful home!",
  },
  {
    name: "Sneha Reddy",
    location: "Golf Course Ext",
    rating: 5,
    content: "The level of professionalism is unmatched. They delivered our luxury villa ahead of schedule without compromising on a single detail. The smart home integration is flawless.",
  },
  {
    name: "Rohan Kapoor",
    location: "Vasant Kunj, Delhi",
    rating: 5,
    content: "Outstanding commercial construction services. They built our corporate office with modern aesthetics and sustainable materials. The workflow during construction was highly organized.",
  },
  {
    name: "Anjali Verma",
    location: "Noida Sector 15",
    rating: 5,
    content: "We chose Rupali for a major renovation. They completely transformed our space into a modern sanctuary. The transparent pricing and daily updates gave us immense peace of mind.",
  },
];
