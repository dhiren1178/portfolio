"use client";

import SolarPanel from "@/components/satellite/SolarPanel";
import Antenna from "@/components/satellite/Antenna";
import Thrusters from "@/components/satellite/Thrusters";
import SatelliteGlow from "@/components/satellite/SatelliteGlow";

/**
 * Placeholder satellite: a body with solar panels, an antenna, thrusters,
 * and a glow sprite — built entirely from primitives so no model asset is
 * required yet. See lib/config/satelliteAssets.ts for the swap point to a
 * real GLB later; SatelliteVisual.tsx is what picks between this and
 * GLBSatellite.tsx, so nothing here needs to change when that happens.
 */
export default function PrimitiveSatellite() {
  return (
    <>
      <mesh>
        <boxGeometry args={[0.035, 0.035, 0.06]} />
        <meshStandardMaterial color="#F2A65A" />
      </mesh>
      <SolarPanel side={1} />
      <SolarPanel side={-1} />
      <Antenna />
      <Thrusters />
      <SatelliteGlow />
    </>
  );
}
