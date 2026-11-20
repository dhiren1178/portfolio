"use client";

import { useGLTF } from "@react-three/drei";

/**
 * Loads a real satellite model. Not used yet — SatelliteVisual.tsx only
 * mounts this once lib/config/satelliteAssets.ts has a `modelPath` set.
 * useOrbitMotion.ts and every call site of <Satellite /> are unaffected
 * by this swap.
 */
export default function GLBSatellite({ path, scale }: { path: string; scale: number }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={scale} />;
}
