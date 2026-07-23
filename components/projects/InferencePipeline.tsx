"use client";

import { motion } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import { pipelineStages } from "@/lib/vegetationData";

export default function InferencePipeline() {
  return (
    <div
      className="flex flex-col md:flex-row items-stretch gap-3 md:gap-2 overflow-x-auto pb-2"
      role="list"
      aria-label="Model inference pipeline, six stages"
    >
      {pipelineStages.map((stage, i) => (
        <div key={stage.id} className="flex items-center gap-2 md:gap-2 shrink-0" role="listitem">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            className="relative w-[180px] shrink-0 rounded-xl border border-white/10 bg-void-panel/50 px-4 py-3.5"
          >
            <motion.div
              className="absolute inset-0 rounded-xl border border-signal/40"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            />
            <p className="font-mono text-[10px] text-signal mb-1">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="font-display text-sm font-semibold text-phosphor">
              {stage.label}
            </p>
            <p className="text-xs text-phosphor-faint mt-0.5">{stage.detail}</p>
          </motion.div>
          {i < pipelineStages.length - 1 && (
            <FiChevronRight
              className="hidden md:block text-phosphor-faint shrink-0"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
