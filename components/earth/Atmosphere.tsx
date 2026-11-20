"use client";

import * as THREE from "three";

/** Thin backside-rendered shell giving the globe a soft atmospheric rim. */
export default function Atmosphere() {
  return (
    <mesh scale={1.035}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#5EEAD4" transparent opacity={0.05} side={THREE.BackSide} />
    </mesh>
  );
}
