"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** A dish antenna on a short mast that slowly sweeps, as if tracking a ground signal. */
export default function Antenna() {
  const dishRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.5;
    }
  });

  return (
    <group position={[0, 0.02, -0.02]}>
      <mesh>
        <cylinderGeometry args={[0.002, 0.002, 0.02, 6]} />
        <meshStandardMaterial color="#5B6472" />
      </mesh>
      <group ref={dishRef} position={[0, 0.011, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.008, 0.004, 12, 1, true]} />
          <meshStandardMaterial color="#EDEFF2" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
