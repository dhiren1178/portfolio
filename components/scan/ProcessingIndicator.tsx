"use client";

import { motion } from "framer-motion";

interface ProcessingIndicatorProps {
  label?: string;
}

/**
 * The "AI Processing" beat of the scan sequence — spinner + staggered
 * progress bars. Extracted out of the Vegetation Height panel so any
 * future scan consumer (the hero's cinematic sequence, a second project)
 * gets the same visual without copy-pasting it.
 */
export default function ProcessingIndicator({
  label = "RUNNING INFERENCE…",
}: ProcessingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-signal/25 border-t-signal"
      />
      <p className="font-mono text-xs text-signal tracking-wide">{label}</p>
      <div className="mt-4 w-full max-w-[220px] space-y-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
            className="h-1 rounded-full bg-void-line overflow-hidden"
          >
            <div className="h-full w-full bg-signal/60" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
