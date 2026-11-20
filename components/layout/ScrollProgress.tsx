"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin "signal strength" bar pinned to the top of the viewport,
 * reads as a mission-progress indicator rather than a generic loader.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-signal z-[90]"
      aria-hidden="true"
    />
  );
}
