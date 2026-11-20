"use client";

import { Suspense } from "react";
import { earthTextures, hasProductionEarthTextures } from "@/lib/config/earthAssets";
import ProceduralSurface from "@/components/earth/ProceduralSurface";
import TexturedSurface from "@/components/earth/TexturedSurface";

/**
 * Single decision point: render the placeholder shader surface, or a
 * production texture-mapped surface, based purely on config. Nothing
 * else in the scene graph needs to know which one is active.
 */
export default function EarthSurface() {
  if (hasProductionEarthTextures(earthTextures)) {
    return (
      <Suspense fallback={<ProceduralSurface />}>
        <TexturedSurface textures={earthTextures} />
      </Suspense>
    );
  }
  return <ProceduralSurface />;
}
