"use client";

import * as THREE from "three";

interface SolarPanelProps {
  side: 1 | -1;
}

/** One solar-panel wing with a simple cell-grid line, mirrored via `side`. */
export default function SolarPanel({ side }: SolarPanelProps) {
  return (
    <group position={[0.05 * side, 0, 0]}>
      <mesh>
        <planeGeometry args={[0.05, 0.022]} />
        <meshStandardMaterial color="#3E7CB1" side={THREE.DoubleSide} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Cell-grid divider lines, purely cosmetic */}
      <mesh position={[0, 0, 0.0006]}>
        <planeGeometry args={[0.05, 0.0006]} />
        <meshBasicMaterial color="#0B0F16" />
      </mesh>
      <mesh position={[0, 0, 0.0006]}>
        <planeGeometry args={[0.0006, 0.022]} />
        <meshBasicMaterial color="#0B0F16" />
      </mesh>
    </group>
  );
}
