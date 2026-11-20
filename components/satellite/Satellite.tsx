"use client";

import { useOrbitMotion, DEFAULT_ORBIT } from "@/components/satellite/useOrbitMotion";
import SatelliteVisual from "@/components/satellite/SatelliteVisual";
import OrbitTrail from "@/components/satellite/OrbitTrail";
import SatelliteOrbitPath from "@/components/satellite/SatelliteOrbitPath";

/**
 * Public entry point: an orbiting satellite with a fading trail and a
 * static orbit-path ring, visual representation swappable via config.
 * DEFAULT_ORBIT is passed explicitly to every piece that needs to know
 * the orbit's shape (motion, trail, path) so they can never drift out of
 * sync with each other.
 */
export default function Satellite() {
  const ref = useOrbitMotion(DEFAULT_ORBIT);
  return (
    <>
      <SatelliteOrbitPath radius={DEFAULT_ORBIT.radius} />
      <OrbitTrail params={DEFAULT_ORBIT} />
      <group ref={ref}>
        <SatelliteVisual />
      </group>
    </>
  );
}
