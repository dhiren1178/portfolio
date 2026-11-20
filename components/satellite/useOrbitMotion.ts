"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface OrbitParams {
  radius: number;
  speed: number;
  verticalAmplitude: number;
}

export const DEFAULT_ORBIT: OrbitParams = {
  radius: 1.8,
  speed: 0.25,
  verticalAmplitude: 0.6,
};

/**
 * Pure position function for the orbit — no side effects, no refs. Both
 * useOrbitMotion (below) and OrbitTrail.tsx call this with the same
 * params, so the trail is guaranteed to trace the satellite's actual
 * path rather than an approximation of it.
 */
export function orbitPosition(t: number, params: OrbitParams): [number, number, number] {
  return [
    Math.cos(t) * params.radius,
    Math.sin(t * 0.6) * params.verticalAmplitude,
    Math.sin(t) * params.radius,
  ];
}

/**
 * Drives an object's position/orientation along a simple elliptical orbit
 * and keeps it facing the globe. Intentionally has no idea what mesh it's
 * moving — same hook works whether that's a primitive placeholder or a
 * loaded GLB, so swapping the visual never touches the motion logic.
 */
export function useOrbitMotion(params: OrbitParams = DEFAULT_ORBIT) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * params.speed;
    if (ref.current) {
      const [x, y, z] = orbitPosition(t, params);
      ref.current.position.set(x, y, z);
      ref.current.lookAt(0, 0, 0);
    }
  });

  return ref;
}
