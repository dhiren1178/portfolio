"use client";

import { Stars } from "@react-three/drei";
import Globe from "@/components/earth/Globe";
import Satellite from "@/components/satellite/Satellite";

export default function EarthScene() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[-3, 3, 5]} intensity={1.7} color="#EDEFF2" />
      <Stars radius={80} depth={40} count={2500} factor={2} saturation={0} fade speed={0.4} />
      <Globe />
      <Satellite />
    </>
  );
}
