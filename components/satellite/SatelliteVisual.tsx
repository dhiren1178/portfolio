"use client";

import { Suspense } from "react";
import { satelliteAsset, hasProductionSatelliteModel } from "@/lib/config/satelliteAssets";
import PrimitiveSatellite from "@/components/satellite/PrimitiveSatellite";
import GLBSatellite from "@/components/satellite/GLBSatellite";

export default function SatelliteVisual() {
  if (hasProductionSatelliteModel(satelliteAsset)) {
    return (
      <Suspense fallback={<PrimitiveSatellite />}>
        <GLBSatellite path={satelliteAsset.modelPath as string} scale={satelliteAsset.modelScale} />
      </Suspense>
    );
  }
  return <PrimitiveSatellite />;
}
