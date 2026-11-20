"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Placeholder Earth surface: a hand-written GLSL shader standing in for a
 * real day-texture material. See lib/config/earthAssets.ts for the swap
 * point — this component is only ever rendered when no production
 * texture is configured (picked by EarthSurface.tsx, not here).
 */

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simple hash-based noise for organic continent-like banding
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    float n = hash(floor(vPosition * 6.0 + uTime * 0.02));
    vec3 ocean = vec3(0.086, 0.196, 0.314);   // ocean blue (#1C4E80 family)
    vec3 land = vec3(0.180, 0.490, 0.357);    // canopy green (#2E7D5B family)
    vec3 base = mix(ocean, land, smoothstep(0.55, 0.6, n));

    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
    vec3 rim = vec3(0.369, 0.918, 0.831) * fresnel * 0.6; // restrained signal-cyan rim

    gl_FragColor = vec4(base + rim, 1.0);
  }
`;

export default function ProceduralSurface() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[1, 96, 96]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={{ uTime: { value: 0 } }}
      />
    </mesh>
  );
}
