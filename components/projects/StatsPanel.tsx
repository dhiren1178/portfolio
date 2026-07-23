"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiActivity } from "react-icons/fi";
import type { VegetationRegion } from "@/lib/vegetationData";
import AnimatedNumber from "@/components/projects/AnimatedNumber";

interface StatsPanelProps {
  region: VegetationRegion | null;
}

const statRows = [
  { key: "avgHeight", label: "Average Tree Height", decimals: 1, suffix: " m" },
  { key: "minHeight", label: "Minimum Height", decimals: 1, suffix: " m" },
  { key: "maxHeight", label: "Maximum Height", decimals: 1, suffix: " m" },
  { key: "density", label: "Vegetation Density", decimals: 0, suffix: "%" },
  { key: "biomass", label: "Estimated Biomass", decimals: 0, suffix: " t/ha" },
] as const;

function Legend() {
  return (
    <div className="mt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-phosphor-faint mb-2">
        Canopy Height Scale
      </p>
      <div className="h-2 w-full rounded-full bg-gradient-to-r from-canopy via-flare to-flare-dim" />
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-phosphor-faint">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}

function ProcessingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-signal/25 border-t-signal"
      />
      <p className="font-mono text-xs text-signal tracking-wide">
        RUNNING INFERENCE…
      </p>
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

export default function StatsPanel({ region }: StatsPanelProps) {
  const [phase, setPhase] = useState<"idle" | "processing" | "result">("idle");

  useEffect(() => {
    if (!region) {
      setPhase("idle");
      return;
    }
    setPhase("processing");
    const t = setTimeout(() => setPhase("result"), 1100);
    return () => clearTimeout(t);
  }, [region]);

  return (
    <div className="glass-panel relative flex min-h-[420px] flex-col rounded-2xl p-6 md:p-7 overflow-hidden">
      {/* Ambient floating particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-signal/40"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: 4 + (i % 5),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center gap-2 mb-2">
        <FiActivity className="text-signal" size={14} aria-hidden="true" />
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-phosphor-faint">
          Inference Result
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-1 flex-col items-center justify-center text-center py-12"
          >
            <p className="text-phosphor-dim text-sm max-w-[220px]">
              Select a region on the map to run the height-estimation model.
            </p>
          </motion.div>
        )}

        {phase === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex-1"
          >
            <ProcessingState />
          </motion.div>
        )}

        {phase === "result" && region && (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative flex-1"
          >
            <h3 className="font-display font-semibold text-lg text-phosphor">
              {region.name}
            </h3>
            <p className="text-xs text-phosphor-faint mb-4">{region.subtitle}</p>

            <dl className="space-y-3">
              {statRows.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between border-b border-white/5 pb-2"
                >
                  <dt className="text-sm text-phosphor-dim">{row.label}</dt>
                  <dd className="font-mono text-base text-phosphor tabular-nums">
                    <AnimatedNumber
                      value={region.stats[row.key]}
                      decimals={row.decimals}
                      suffix={row.suffix}
                    />
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-phosphor-dim">Confidence Score</span>
              <span className="font-mono text-base text-signal tabular-nums">
                <AnimatedNumber value={region.stats.confidence} suffix="%" />
              </span>
            </div>

            <Legend />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
