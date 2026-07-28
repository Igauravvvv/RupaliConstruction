import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
  { 
    id: 'structural', 
    label: 'Structural', 
    desc: 'Foundation, core framing, and heavy structural engineering.',
    details: 'The structural phase forms the unbreakable backbone of your villa. We utilize high-grade steel I-beams, cross-bracing, and reinforced concrete to ensure maximum durability, earthquake resistance, and structural integrity for generations to come.',
    image: '/villa_structural.png'
  },
  { 
    id: 'rough', 
    label: 'Rough-In', 
    desc: 'Exterior walls, roofing, MEP systems, and insulation.',
    details: 'During the rough-in phase, the skeleton becomes a home. We install premium insulation, state-of-the-art HVAC systems, advanced smart-home wiring, and specialized plumbing—all meticulously routed before the walls are closed up.',
    image: '/villa_rough.png'
  },
  { 
    id: 'finished', 
    label: 'Finished', 
    desc: 'Premium facade, luxurious interiors, and final handover.',
    details: 'The grand finale. Your vision comes to life with exquisite materials, flawless architectural finishes, imported glass, and luxury landscaping. Welcome to your new ultra-premium Rupali Construction masterpiece.',
    image: '/villa_finished.png'
  }
];

function Celebration() {
  const colors = ['#fde047', '#38bdf8', '#fb7185', '#34d399', '#a78bfa'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {/* Left side confetti stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`left-${i}`}
          initial={{ opacity: 0, x: -50, y: '100%', scale: 0 }}
          animate={{ 
            opacity: [1, 1, 0],
            x: Math.random() * 400 - 100, 
            y: -(Math.random() * 500 + 100),
            scale: Math.random() * 1 + 0.5,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute bottom-0 left-10"
          style={{ color: colors[i % colors.length] }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
        </motion.div>
      ))}

      {/* Right side confetti stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`right-${i}`}
          initial={{ opacity: 0, x: 50, y: '100%', scale: 0 }}
          animate={{ 
            opacity: [1, 1, 0],
            x: -(Math.random() * 400 - 100), 
            y: -(Math.random() * 500 + 100),
            scale: Math.random() * 1 + 0.5,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute bottom-0 right-10"
          style={{ color: colors[i % colors.length] }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
        </motion.div>
      ))}
    </div>
  );
}

export default function ConstructionProcess() {
  const [activePhase, setActivePhase] = useState(0);

  // Auto-play the animation every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % phases.length);
    }, 2000); // 2 seconds for a real quick switch
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-[var(--rc-white)]">
      <div className="container-rc relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display text-[var(--rc-dark)] mb-4">The Construction Process</h2>
          <p className="text-[var(--rc-muted)] max-w-2xl mx-auto">Watch our photorealistic renders showcase how we transform raw materials into premium living spaces.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-[var(--rc-gray)] rounded-3xl p-6 md:p-12 border border-[var(--rc-border)] shadow-xl relative overflow-hidden">
          
          {/* Photorealistic Image Crossfader */}
          <div className="w-full h-[400px] md:h-[600px] relative flex items-center justify-center bg-black rounded-2xl mb-8 border border-gray-100 shadow-inner overflow-hidden cursor-pointer" onClick={() => setActivePhase((prev) => (prev + 1) % phases.length)}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activePhase}
                src={phases[activePhase].image}
                alt={phases[activePhase].label}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Subtle Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Celebration Effect for Finished Phase */}
            {activePhase === 2 && <Celebration />}
            
            {/* Phase Label Floating on Image */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div>
                <motion.h3 
                  key={`title-${activePhase}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-3xl md:text-4xl font-display font-bold drop-shadow-lg"
                >
                  {phases[activePhase].label} Phase
                </motion.h3>
                <motion.p 
                  key={`desc-${activePhase}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/90 text-lg md:text-xl drop-shadow-md mt-2 max-w-xl"
                >
                  {phases[activePhase].desc}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Controls / Tabs */}
          <div className="flex flex-row gap-2 md:gap-4 justify-between items-center bg-white p-2 rounded-2xl md:rounded-full border border-[var(--rc-border)] mb-8">
            {phases.map((phase, idx) => {
              const isActive = activePhase === idx;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(idx)}
                  className={`relative px-1 py-3 sm:px-4 md:px-6 md:py-4 rounded-xl md:rounded-full w-1/3 text-center transition-colors duration-300 overflow-hidden ${isActive ? 'text-white' : 'text-[var(--rc-muted)] hover:text-[var(--rc-dark)]'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePhaseTab"
                      className="absolute inset-0 bg-[var(--rc-blue)] rounded-xl md:rounded-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    >
                      {/* Auto-play Progress Bar */}
                      <motion.div
                        key={`progress-${activePhase}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "linear" }}
                        className="absolute top-0 left-0 bottom-0 bg-white/20 rounded-xl md:rounded-full"
                      />
                    </motion.div>
                  )}
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <span className="block text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider">{phase.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Explanation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`details-${activePhase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-[var(--rc-border)] shadow-sm text-center"
            >
              <h4 className="text-2xl font-display text-[var(--rc-dark)] mb-3">{phases[activePhase].label} Details</h4>
              <p className="text-[var(--rc-muted)] text-lg leading-relaxed max-w-3xl mx-auto">
                {phases[activePhase].details}
              </p>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
