"use client";

import * as THREE from "three";

interface OrbitRingConfig {
  tilt: number;
  color: string;
}

const DEFAULT_RINGS: OrbitRingConfig[] = [
  { tilt: 0.35, color: "#5EEAD4" },
  { tilt: -0.5, color: "#4CAF7D" },
  { tilt: 0.15, color: "#5EEAD4" },
];

/** Thin tilted rings suggesting satellite orbital planes around the globe. */
export default function OrbitRings({ rings = DEFAULT_RINGS }: { rings?: OrbitRingConfig[] }) {
  return (
    <>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + ring.tilt, ring.tilt, 0]}>
          <ringGeometry args={[1.25 + i * 0.12, 1.252 + i * 0.12, 128]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}
