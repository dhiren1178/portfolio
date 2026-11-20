"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gestures, generateMockPrediction, type Prediction } from "@/lib/signLanguageData";
import { cn } from "@/lib/utils";

const PREDICTION_INTERVAL_MS = 1800;

export default function ConfidenceBars() {
  const [predictions, setPredictions] = useState<Prediction[]>(() =>
    generateMockPrediction()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPredictions(generateMockPrediction());
    }, PREDICTION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const topGesture = gestures.find((g) => g.id === predictions[0]?.gestureId);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-phosphor-faint">
          Prediction
        </p>
        <motion.span
          key={topGesture?.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] text-signal"
        >
          LIVE
        </motion.span>
      </div>
      <motion.h3
        key={topGesture?.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-bold text-2xl text-phosphor mb-5"
      >
        {topGesture?.label ?? "—"}
      </motion.h3>

      <div className="space-y-2.5">
        {predictions.map((p, i) => {
          const gesture = gestures.find((g) => g.id === p.gestureId);
          return (
            <div key={p.gestureId} className="flex items-center gap-3">
              <span
                className={cn(
                  "w-20 shrink-0 text-xs font-mono",
                  i === 0 ? "text-signal" : "text-phosphor-faint"
                )}
              >
                {gesture?.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-void-line">
                <motion.div
                  animate={{ width: `${p.confidence * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "h-full rounded-full",
                    i === 0 ? "bg-signal" : "bg-ocean-light/60"
                  )}
                />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-xs text-phosphor-dim tabular-nums">
                {Math.round(p.confidence * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
