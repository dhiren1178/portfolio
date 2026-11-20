"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import EarthSurface from "@/components/earth/EarthSurface";
import Atmosphere from "@/components/earth/Atmosphere";
import SensorPoints from "@/components/earth/SensorPoints";
import OrbitRings from "@/components/earth/OrbitRings";

/**
 * Owns rotation and cursor-parallax only. Composes the surface, glow,
 * sensor overlay, and orbit rings as independent children — swapping any
 * one of those (e.g. the surface, when real textures arrive) never
 * touches this file.
 */
export default function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.06;
    const targetX = pointer.y * 0.15;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.02
    );
  });

  return (
    <group ref={groupRef}>
      <EarthSurface />
      <Atmosphere />
      <SensorPoints />
      <OrbitRings />
    </group>
  );
}
