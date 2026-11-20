"use client";

import * as THREE from "three";

interface SatelliteOrbitPathProps {
  radius: number;
}

/**
 * A thin static ring at the satellite's orbital radius, in the flat plane
 * its orbit weaves gently above and below. Distinct from the globe's
 * decorative OrbitRings (components/earth/OrbitRings.tsx) — this one
 * corresponds to the satellite's actual, literal orbit radius.
 */
export default function SatelliteOrbitPath({ radius }: SatelliteOrbitPathProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.004, radius, 128]} />
      <meshBasicMaterial color="#5EEAD4" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}
