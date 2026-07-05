import { Link } from "react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import BuildingLineArt from "@/components/BuildingLineArt";
import TypingAnimation from "@/components/TypingAnimation";

export default function Hero() {

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[var(--rc-white)]">
      {/* 3D Line-Art Background */}
      <BuildingLineArt className="opacity-10" />

      <div className="relative z-10 container-rc pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-6">
            <span className="text-label text-[var(--rc-orange)] mb-4 inline-block px-4 py-1.5 rounded-full bg-[var(--rc-orange)]/10">
              Premium Construction Solutions
            </span>
          </div>

          <h1 className="mb-6">
            <span className="text-display-2 uppercase text-[var(--rc-blue)] block">
              Building
            </span>
            <TypingAnimation />
            <span className="text-display-1 text-[var(--rc-blue)] block">
              for Tomorrow
            </span>
          </h1>

          <p className="text-lg text-[var(--rc-text)] max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium residential and commercial construction solutions engineered
            for quality, transparency, and timely delivery across Gurgaon and
            Delhi NCR.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/contact"
              className="group px-8 py-4 bg-[var(--rc-orange)] text-white font-medium rounded-full hover:bg-[var(--rc-dark)] focus:ring-2 focus:ring-offset-2 focus:ring-[var(--rc-orange)] focus:outline-none transition-all flex items-center gap-2 shadow-xl shadow-[var(--rc-orange)]/20 hover:scale-105"
            >
              Get Free Estimate
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/projects"
              className="px-8 py-4 border-2 border-[var(--rc-blue)] text-[var(--rc-blue)] font-medium rounded-full hover:bg-[var(--rc-blue)] hover:text-white focus:ring-2 focus:ring-offset-2 focus:ring-[var(--rc-blue)] focus:outline-none transition-all hover:scale-105 inline-flex items-center gap-2 group"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--rc-dark)] font-medium">
            {["Fixed Pricing", "Live Project Tracking", "Quality Assurance"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--rc-orange)]" />
                  {item}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
