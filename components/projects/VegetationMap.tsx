"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { vegetationRegions, type VegetationRegion } from "@/lib/vegetationData";
import { cn } from "@/lib/utils";

/**
 * DESIGN NOTE
 * Real Sentinel-2/Cartosat tiles aren't something we can license as a
 * placeholder asset, so the "satellite view" is a procedural stylized
 * terrain map: layered noise-like patches in canopy/ocean tones, an
 * urban grid overlay near the ridge, and a faint scanline texture — it
 * reads as sensor data rather than a stock photo, consistent with the
 * hero globe's approach.
 */

interface VegetationMapProps {
  selectedId: string | null;
  onSelect: (region: VegetationRegion) => void;
}

// A handful of static blob shapes to suggest terrain variation without
// needing real geo data. Purely decorative.
const terrainPatches = [
  { cx: 20, cy: 25, r: 14, fill: "#12314D" },
  { cx: 55, cy: 15, r: 18, fill: "#1C4B38" },
  { cx: 70, cy: 55, r: 22, fill: "#1C4B38" },
  { cx: 30, cy: 70, r: 16, fill: "#12314D" },
  { cx: 85, cy: 20, r: 10, fill: "#12314D" },
];

export default function VegetationMap({ selectedId, onSelect }: VegetationMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-void-deep">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Stylized satellite map with three selectable vegetation regions: New Delhi Ridge, Western Ghats Reserve, and Sundarbans Mangrove Belt"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0B0F16" />
            <stop offset="100%" stopColor="#030406" />
          </radialGradient>
          <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M4 0H0V4" fill="none" stroke="#151B26" strokeWidth="0.2" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#mapGlow)" />
        <rect width="100" height="100" fill="url(#grid)" />

        {terrainPatches.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} opacity={0.55} />
        ))}

        {/* Urban grid suggestion near the ridge region */}
        <g opacity={0.25} stroke="#3E7CB1" strokeWidth="0.15">
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1={25} y1={38 + i * 3} x2={50} y2={38 + i * 3} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`v${i}`} x1={25 + i * 5} y1={38} x2={25 + i * 5} y2={56} />
          ))}
        </g>

        {/* Region hotspots */}
        {vegetationRegions.map((region) => {
          const isActive = selectedId === region.id;
          const isHovered = hoveredId === region.id;
          return (
            <g
              key={region.id}
              onMouseEnter={() => setHoveredId(region.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(region)}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`View vegetation stats for ${region.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(region);
              }}
            >
              {/* Scan sweep clip on hover */}
              {isHovered && (
                <clipPath id={`clip-${region.id}`}>
                  <circle cx={region.x} cy={region.y} r={region.radius} />
                </clipPath>
              )}
              {isHovered && (
                <rect
                  x={region.x - region.radius}
                  y={region.y - region.radius}
                  width={region.radius * 2}
                  height={region.radius * 2}
                  clipPath={`url(#clip-${region.id})`}
                  fill="url(#scanGradient)"
                  className="animate-scan"
                />
              )}

              <circle
                cx={region.x}
                cy={region.y}
                r={region.radius}
                fill={isActive ? "#4CAF7D" : "#2E7D5B"}
                fillOpacity={isActive ? 0.35 : 0.2}
                stroke={isActive || isHovered ? "#5EEAD4" : "#4CAF7D"}
                strokeWidth={isActive ? 0.5 : 0.25}
              />
              <circle cx={region.x} cy={region.y} r={0.8} fill="#5EEAD4">
                {!isActive && (
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur="2.4s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            </g>
          );
        })}

        <defs>
          <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0" />
            <stop offset="50%" stopColor="#5EEAD4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Hover label */}
      {hoveredId && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-4 top-4 rounded-lg glass-panel px-3 py-2 font-mono text-xs text-signal"
        >
          {vegetationRegions.find((r) => r.id === hoveredId)?.name}
        </motion.div>
      )}

      {/* Region legend chips (also clickable, for touch devices) */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        {vegetationRegions.map((region) => (
          <button
            key={region.id}
            onClick={() => onSelect(region)}
            className={cn(
              "focus-ring rounded-full px-3 py-1.5 text-xs font-mono transition-colors duration-300 glass-panel",
              selectedId === region.id
                ? "text-signal border-signal/50"
                : "text-phosphor-dim hover:text-phosphor"
            )}
          >
            {region.name}
          </button>
        ))}
      </div>
    </div>
  );
}
