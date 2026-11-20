"use client";

interface HeatmapOverlayProps {
  id: string;
  cx: number;
  cy: number;
  radius: number;
  /** 0–1, scales opacity — a natural hook for "confidence" or "density" later. */
  intensity?: number;
  visible: boolean;
}

/**
 * A green→amber radial wash over the scanned region, standing in for a
 * per-pixel prediction heatmap. Reads as data overlaid on terrain rather
 * than a decorative glow, consistent with the canopy→flare legend used
 * elsewhere on the Vegetation Height page.
 */
export default function HeatmapOverlay({
  id,
  cx,
  cy,
  radius,
  intensity = 1,
  visible,
}: HeatmapOverlayProps) {
  if (!visible) return null;
  const gradientId = `heatmap-${id}`;

  return (
    <>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F2A65A" stopOpacity={0.65 * intensity} />
          <stop offset="55%" stopColor="#2E7D5B" stopOpacity={0.4 * intensity} />
          <stop offset="100%" stopColor="#2E7D5B" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radius * 1.5} fill={`url(#${gradientId})`} />
    </>
  );
}
