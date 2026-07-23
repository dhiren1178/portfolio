"use client";

import { useCallback, useRef, useState } from "react";
import { FiMove } from "react-icons/fi";

/**
 * Drag (or use arrow keys when focused) to reveal the raw satellite tile
 * vs. the model's predicted height-map overlay. Both "images" are
 * procedural gradients/patterns — see VegetationMap.tsx design note.
 */
export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percent

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    updateFromClientX(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full select-none overflow-hidden rounded-2xl border border-white/10"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* "After" layer: predicted height map (full width, base layer) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #1C4B38 0%, #2E7D5B 35%, #F2A65A 65%, #8A5A28 100%)",
        }}
        aria-hidden="true"
      >
        <div className="absolute bottom-3 right-3 rounded-md bg-void/70 px-2 py-1 font-mono text-[10px] text-signal">
          AI HEIGHT MAP
        </div>
      </div>

      {/* "Before" layer: raw satellite tile, clipped to slider position */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          background:
            "linear-gradient(135deg, #05070A 0%, #12314D 40%, #1C4E80 70%, #3E7CB1 100%)",
        }}
        aria-hidden="true"
      >
        <div className="absolute bottom-3 left-3 rounded-md bg-void/70 px-2 py-1 font-mono text-[10px] text-phosphor-dim">
          RAW SATELLITE
        </div>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-px bg-signal"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label="Comparison slider between raw satellite tile and AI height map"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
          }}
          className="focus-ring absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-signal text-void shadow-lg"
        >
          <FiMove size={14} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
