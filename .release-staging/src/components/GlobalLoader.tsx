import { motion } from "framer-motion";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--rc-gray)]">
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-200 border-t-[var(--rc-orange)] border-b-[var(--rc-blue)] rounded-full mb-4"
        />
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="text-sm font-bold text-gray-500 uppercase tracking-widest"
        >
          Building...
        </motion.div>
      </div>
    </div>
  );
}
