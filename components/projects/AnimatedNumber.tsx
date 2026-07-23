"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  durationMs?: number;
}

/**
 * Counts up from its previous value to `value` whenever `value` changes.
 * Used for every stat readout in the Vegetation Height panel.
 */
export default function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  className,
  durationMs = 1200,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => v.toFixed(decimals));
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
    });
    prevValue.current = value;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
