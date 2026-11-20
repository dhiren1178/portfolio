"use client";

interface ScanBeamProps {
  id: string;
  cx: number;
  cy: number;
  radius: number;
  active: boolean;
  color?: string;
}

/**
 * A beam sweeps once across a circular target region, clipped to that
 * circle. Purely presentational — driven by `active`, which callers
 * typically wire to `phase === "scanning"` from useScanSequence.
 * Self-contained gradient/clip ids (keyed by `id`) so multiple beams can
 * exist in the same SVG without colliding.
 */
export default function ScanBeam({ id, cx, cy, radius, active, color = "#5EEAD4" }: ScanBeamProps) {
  if (!active) return null;
  const clipId = `scan-clip-${id}`;
  const gradientId = `scan-gradient-${id}`;

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={radius} />
        </clipPath>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x={cx - radius}
        y={cy - radius}
        width={radius * 2}
        height={radius * 2}
        clipPath={`url(#${clipId})`}
        fill={`url(#${gradientId})`}
        className="animate-scan"
      />
    </>
  );
}
