import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

/**
 * Custom cursor follower — only visible on desktop (non-touch) devices.
 * Shows a subtle circle that tracks the mouse and grows/changes color
 * when hovering over interactive brand-tree elements.
 */
export default function CursorFollower() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const isTouch = useRef(false);

  // Spring-animated cursor position
  const cursorX = useSpring(0, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 300, mass: 0.5 });

  useEffect(() => {
    // Detect touch device — hide cursor follower entirely
    const touchCheck = () => {
      isTouch.current = true;
    };
    window.addEventListener("touchstart", touchCheck, { once: true });

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch.current) return;
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check if hovering over an interactive element
      const target = e.target as HTMLElement;
      const interactive = target.closest("[data-interactive]");
      setIsHoveringInteractive(!!interactive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => {
      if (!isTouch.current) setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("touchstart", touchCheck);
    };
  }, [cursorX, cursorY]);

  // Don't render for reduced motion preference or touch devices
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          width: isHoveringInteractive ? 40 : 24,
          height: isHoveringInteractive ? 40 : 24,
          backgroundColor: isHoveringInteractive
            ? "rgba(255, 107, 26, 0.5)"
            : "rgba(11, 46, 89, 0.25)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          backdropFilter: "blur(1px)",
        }}
      />
    </motion.div>
  );
}
