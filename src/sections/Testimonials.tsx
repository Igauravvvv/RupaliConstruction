import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TestimonialCard } from "@/components/ui/testimonial-card";

export default function Testimonials() {
  const { data } = trpc.testimonial.list.useQuery({ limit: 6 });
  const testimonials = data || fallbackTestimonials;

  const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  ];

  const mappedTestimonials = testimonials.map((t, i) => ({
    author: {
      name: t.name,
      handle: t.location || "Verified Client",
      avatar: avatars[i % avatars.length]
    },
    text: t.content
  }));

  return (
    <section className="py-24 lg:py-32 bg-[var(--rc-gray)] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-[0.03] translate-x-1/4">
        <img
          src="/logo-icon.png"
          alt=""
          className="w-full max-w-[800px] object-contain"
        />
      </div>

      <div className="mx-auto flex w-full flex-col items-center gap-4 text-center sm:gap-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 px-4 sm:gap-8"
        >
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="text-6xl lg:text-[7rem] leading-none font-serif italic text-[var(--rc-orange)] mb-2 drop-shadow-sm"
          >
            Testimonials
          </motion.p>
          <h2 className="max-w-[720px] text-xl md:text-2xl font-medium text-[var(--rc-dark)]">
            What Our Clients Say
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-lg">
            Join thousands of happy homeowners who built their future with us.
          </p>
        </motion.div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-4">
          <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row [--duration:25s]">
            {/* First Set */}
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {mappedTestimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={`set1-${i}`}
                  {...testimonial}
                />
              ))}
            </div>

            {/* Second Set (identical duplicate for seamless loop) */}
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]" aria-hidden="true">
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
  {
    name: "Sanjay Patel",
    location: "Faridabad NIT",
    rating: 5,
    content: "Reliable, trustworthy, and incredibly skilled. They handled the complex structural work of our multi-story building with absolute precision. Best contractors in the NCR region.",
  },
  {
    name: "Kavita Rao",
    location: "DLF Phase 5, Gurgaon",
    rating: 5,
    content: "The finishing quality of their work is simply breathtaking. Every corner of our new home reflects premium luxury. Their design inputs were invaluable during the process.",
  },
  {
    name: "Manish Jain",
    location: "Udyog Vihar",
    rating: 5,
    content: "A fantastic partner for industrial construction. They completed our warehouse facility adhering to all safety standards and within the exact budget we discussed on day one.",
  },
  {
    name: "Pooja Bhatia",
    location: "South Delhi",
    rating: 5,
    content: "From the foundation to the final coat of paint, the dedication of the Rupali team is visible. They truly craft dreams into reality. We couldn't be happier with our bespoke residence.",
  }
];
