"use client";

import { useMemo } from "react";

/**
 * Decorative "sensor grid" scattered evenly over the globe surface via a
 * Fibonacci sphere distribution. Independent of which Earth surface is
 * active (procedural or textured) — this stays as a signature visual
 * layer either way.
 */
export default function SensorPoints({ count = 900 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.012;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#9AF9E8" sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}
