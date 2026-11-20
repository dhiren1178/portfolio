"use client";

import { useMemo } from "react";
import * as THREE from "three";

function createGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, "rgba(94, 234, 212, 0.9)");
    gradient.addColorStop(0.4, "rgba(94, 234, 212, 0.35)");
    gradient.addColorStop(1, "rgba(94, 234, 212, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

/**
 * A soft additive-blended billboard sprite standing in for real bloom
 * postprocessing — @react-three/postprocessing isn't installed, and per
 * the "assets/visual-polish last" directive, adding a new rendering
 * dependency for a glow effect isn't warranted yet. This gets a
 * comparable look for near-zero cost and no new dependency; swapping to
 * true bloom later is a rendering-pipeline change, not something this
 * component needs to anticipate.
 */
export default function SatelliteGlow() {
  const texture = useMemo(() => createGlowTexture(), []);

  return (
    <sprite scale={[0.05, 0.05, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}
