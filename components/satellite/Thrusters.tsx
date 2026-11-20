"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Two small aft thrusters with a pulsing flame — purely cosmetic. */
export default function Thrusters() {
  const flameRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    flameRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pulse = 0.6 + Math.sin(t * 8 + i * Math.PI) * 0.3;
      mesh.scale.setScalar(pulse);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.4 + pulse * 0.3;
    });
  });

  const xPositions = [-0.008, 0.008];

  return (
    <>
      {xPositions.map((x, i) => (
        <group key={i} position={[x, 0, 0.032]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.003, 0.008, 8]} />
            <meshStandardMaterial color="#151B26" />
          </mesh>
          <mesh
            ref={(el) => {
              flameRefs.current[i] = el;
            }}
            position={[0, 0, 0.008]}
          >
            <sphereGeometry args={[0.0025, 8, 8]} />
            <meshBasicMaterial color="#F2A65A" transparent opacity={0.6} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}
