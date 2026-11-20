"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { orbitPosition, type OrbitParams } from "@/components/satellite/useOrbitMotion";

interface OrbitTrailProps {
  params: OrbitParams;
  count?: number;
  /** Time-units (post speed-scaling) between consecutive trail points. */
  spacing?: number;
}

/**
 * A fading trail of "ghost" points behind the satellite. Because the
 * orbit is a deterministic function of elapsed time (see orbitPosition in
 * useOrbitMotion.ts), the trail doesn't need to record where the
 * satellite has been — each point is just that same function evaluated a
 * little earlier, which is simpler than accumulating per-frame history
 * and can't drift out of sync with the satellite's actual path.
 */
export default function OrbitTrail({ params, count = 10, spacing = 0.05 }: OrbitTrailProps) {
  const pointsRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * params.speed;
    pointsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const lagT = t - (i + 1) * spacing;
      const [x, y, z] = orbitPosition(lagT, params);
      mesh.position.set(x, y, z);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 * (1 - (i + 1) / (count + 1));
    });
  });

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => { pointsRef.current[i] = el; }}>
          <sphereGeometry args={[0.007, 6, 6]} />
          <meshBasicMaterial color="#5EEAD4" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}
