"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { statusRows, metricRows, statusColor } from "@/lib/missionControlData";
import AnimatedNumber from "@/components/projects/AnimatedNumber";

/**
 * Replaces the "hero text" pattern with a live-reading instrument panel —
 * a flat, hairline-bordered surface (no blur, no heavy glow) with a
 * staggered boot-in sequence and small ongoing jitter on the numeric rows,
 * so it reads as a running system rather than a static graphic.
 */
export default function MissionControlPanel() {
  const [liveValues, setLiveValues] = useState(
    () => Object.fromEntries(metricRows.map((m) => [m.id, m.baseValue]))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveValues((prev) => {
        const next = { ...prev };
        metricRows.forEach((m) => {
          if (m.jitter === 0) return;
          const delta = (Math.random() - 0.5) * 2 * m.jitter;
          next[m.id] = m.baseValue + delta;
        });
        return next;
      });
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel-hairline glass-panel w-full max-w-[300px] rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-phosphor-faint">
          Mission Control
        </span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-1.5 w-1.5 rounded-full bg-canopy-light"
          aria-hidden="true"
        />
      </div>

      <dl className="space-y-2.5">
        {statusRows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
            className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs"
          >
            <dt className="text-phosphor-faint">{row.label}</dt>
            <dd className="flex items-center gap-1.5 font-mono tabular-nums" style={{ color: statusColor(row.status) }}>
              <span
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: statusColor(row.status) }}
                aria-hidden="true"
              />
              {row.value}
            </dd>
          </motion.div>
        ))}

        {metricRows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + (statusRows.length + i) * 0.08 }}
            className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs last:border-0 last:pb-0"
          >
            <dt className="text-phosphor-faint">{row.label}</dt>
            <dd className="font-mono tabular-nums text-phosphor" style={{ color: statusColor(row.status) }}>
              <AnimatedNumber
                value={liveValues[row.id]}
                decimals={row.decimals}
                suffix={row.suffix}
                durationMs={800}
              />
            </dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}
