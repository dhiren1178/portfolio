"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ScanPhase = "idle" | "scanning" | "processing" | "result";

export interface UseScanSequenceOptions {
  /** How long the beam-sweep visual plays before processing begins. */
  scanDurationMs?: number;
  /** How long the "AI processing" state holds before the result reveals. */
  processingDurationMs?: number;
}

/**
 * Drives the shared scan → process → result sequence:
 *
 *   idle --runScan(id)--> scanning --> processing --> result
 *
 * This is the state machine behind "Satellite → Scan Beam → Ground
 * Highlight → Heatmap → AI Processing → Prediction → Visualization" from
 * the spec. It knows nothing about satellites, maps, or vegetation — any
 * scene that wants the same beat (the hero's future "scan sweeps to
 * India" sequence included) can drive its own visuals off `phase` and
 * `targetId` without re-implementing the timing logic.
 */
export function useScanSequence({
  scanDurationMs = 900,
  processingDurationMs = 1100,
}: UseScanSequenceOptions = {}) {
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [targetId, setTargetId] = useState<string | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const runScan = useCallback(
    (id: string) => {
      clearTimers();
      setTargetId(id);
      setPhase("scanning");
      timeouts.current.push(
        setTimeout(() => setPhase("processing"), scanDurationMs)
      );
      timeouts.current.push(
        setTimeout(
          () => setPhase("result"),
          scanDurationMs + processingDurationMs
        )
      );
    },
    [scanDurationMs, processingDurationMs]
  );

  const reset = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setTargetId(null);
  }, []);

  // Clear any in-flight timers on unmount so late setState calls never fire.
  useEffect(() => clearTimers, []);

  return { phase, targetId, runScan, reset };
}
