"use client";

import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import EarthScene from "@/components/earth/EarthScene";

export default function EarthCanvas({ fallback }: { fallback?: ReactNode }) {
  return (
    <Canvas
      fallback={fallback}
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.8]}
    >
      <EarthScene />
    </Canvas>
  );
}
