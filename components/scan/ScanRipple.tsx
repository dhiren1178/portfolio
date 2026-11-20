"use client";

import { motion } from "framer-motion";

interface ScanRippleProps {
  cx: number;
  cy: number;
  maxRadius: number;
  active: boolean;
  color?: string;
}

/**
 * Three staggered rings expand outward once and fade — the "ground
 * highlight" beat between the scan beam and the heatmap appearing.
 * Plays once per mount, so callers should remount it per scan (e.g. by
 * keying on targetId) rather than toggling `active` on a persistent node.
 */
export default function ScanRipple({ cx, cy, maxRadius, active, color = "#5EEAD4" }: ScanRippleProps) {
  if (!active) return null;

  return (
    <>
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          fill="none"
          stroke={color}
          strokeWidth={0.4}
          initial={{ r: 0, opacity: 0.6 }}
          animate={{ r: maxRadius, opacity: 0 }}
          transition={{ duration: 1.1, delay, ease: "easeOut" }}
        />
      ))}
    </>
  );
}
