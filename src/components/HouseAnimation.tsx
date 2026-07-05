import { motion } from "framer-motion";

export default function HouseAnimation() {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = 1 + i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.01 },
        },
      };
    },
  };

  return (
    <div className="w-full h-full min-h-[300px] bg-white rounded-[32px] border border-gray-200 shadow-sm flex flex-col items-center justify-center p-8 sticky top-32">
      <div className="text-center mb-8">
        <h3 className="text-[#0F172A] font-bold font-serif text-2xl mb-2">Building Dreams</h3>
        <p className="text-gray-500 text-sm">Precision in every detail</p>
      </div>
      
      <motion.svg
        width="160"
        height="160"
        viewBox="0 0 200 200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        className="text-[var(--rc-blue)] overflow-visible"
      >
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--rc-blue)" />
            <stop offset="100%" stopColor="var(--rc-orange)" />
          </linearGradient>
        </defs>
        
        {/* Foundation & Base */}
        <motion.path
          d="M 20 180 L 180 180"
          stroke="url(#blueGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={draw}
          custom={0}
        />

        {/* Walls */}
        <motion.path
          d="M 40 180 L 40 80 M 160 180 L 160 80"
          stroke="url(#blueGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={draw}
          custom={1}
        />

        {/* Roof */}
        <motion.path
          d="M 20 90 L 100 20 L 180 90"
          stroke="url(#blueGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={draw}
          custom={2}
        />

        {/* Door */}
        <motion.path
          d="M 85 180 L 85 120 C 85 110 115 110 115 120 L 115 180"
          stroke="url(#blueGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={draw}
          custom={3}
        />

        {/* Window Left */}
        <motion.path
          d="M 55 130 L 70 130 L 70 145 L 55 145 Z"
          stroke="url(#blueGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={draw}
          custom={4}
        />

        {/* Window Right */}
        <motion.path
          d="M 130 130 L 145 130 L 145 145 L 130 145 Z"
          stroke="url(#blueGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={draw}
          custom={4}
        />

        {/* Chimney */}
        <motion.path
          d="M 135 60 L 135 25 L 155 25 L 155 75"
          stroke="url(#blueGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={draw}
          custom={5}
        />
        
        {/* Crane / Construction Element (adds that 'building' feel) */}
        <motion.path
          d="M 20 20 L 80 20 L 80 40 M 80 20 L 100 0"
          stroke="var(--rc-orange)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
          fill="none"
          variants={draw}
          custom={6}
        />
      </motion.svg>
      
      <div className="mt-8 pt-6 border-t border-gray-100 w-full text-center">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Constructing the future</p>
      </div>
    </div>
  );
}
