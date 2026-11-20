"use client";

import VegetationMap from "@/components/projects/VegetationMap";
import StatsPanel from "@/components/projects/StatsPanel";
import { useScanSequence } from "@/components/scan/useScanSequence";
import { vegetationRegions } from "@/lib/vegetationData";

/**
 * The only genuinely interactive slice of the Vegetation Height page —
 * isolated here so the page itself can stay a server component (and
 * export route metadata directly, which a "use client" page cannot do).
 *
 * Owns the shared scan sequence (see components/scan/) and hands the
 * current phase + target down to the map (beam/ripple/heatmap) and the
 * stats panel (processing/result), so there's a single source of truth
 * for "what's happening right now" instead of each panel guessing from
 * a region prop alone.
 */
export default function VegetationExplorer() {
  const { phase, targetId, runScan } = useScanSequence({
    scanDurationMs: 900,
    processingDurationMs: 1100,
  });

  const targetRegion = targetId
    ? vegetationRegions.find((r) => r.id === targetId) ?? null
    : null;

  return (
    <>
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <VegetationMap
          selectedId={targetId}
          phase={phase}
          onSelect={(region) => runScan(region.id)}
        />
        <StatsPanel phase={phase} region={targetRegion} />
      </div>
      <p className="mt-3 text-xs text-phosphor-faint">
        Click a region marker, or one of the chips below the map, to run the model.
      </p>
    </>
  );
}
