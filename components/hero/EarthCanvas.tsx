"use client";

import { Canvas } from "@react-three/fiber";
import Earth from "@/components/hero/Earth";

export default function EarthCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.8]}
    >
      <Earth />
    </Canvas>
  );
}
