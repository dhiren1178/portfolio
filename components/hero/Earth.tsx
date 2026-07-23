"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * DESIGN NOTE
 * Rather than a photoreal NASA-texture globe (the default choice, and one
 * that requires licensed imagery we don't have), the Earth here is rendered
 * as a live "sensor sphere": a glowing procedural surface overlaid with a
 * scatter of data points, like a satellite constellation reading the planet
 * rather than a photograph of it. This is the site's signature 3D element.
 */

const SURFACE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SURFACE_FRAGMENT_SHADER = /* glsl */ `
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
    vec3 rim = vec3(0.369, 0.918, 0.831) * fresnel; // signal cyan rim glow

    gl_FragColor = vec4(base + rim * 0.9, 1.0);
  }
`;

function useSensorPoints(count: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution for even coverage
      const t = i / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.012;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count]);
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();
  const points = useSensorPoints(900);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Idle auto-rotation
      groupRef.current.rotation.y += delta * 0.06;
      // Gentle parallax toward pointer
      const targetX = pointer.y * 0.15;
      const targetY = groupRef.current.rotation.y + pointer.x * 0.02;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.02
      );
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core sensor sphere */}
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={SURFACE_VERTEX_SHADER}
          fragmentShader={SURFACE_FRAGMENT_SHADER}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>

      {/* Atmosphere shell */}
      <mesh scale={1.035}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#5EEAD4"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Data point scatter (sensor grid) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.012} color="#9AF9E8" sizeAttenuation transparent opacity={0.85} />
      </points>

      {/* Orbit rings, tilted at different angles like satellite planes */}
      {[0.35, -0.5, 0.15].map((tilt, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + tilt, tilt, 0]}>
          <ringGeometry args={[1.25 + i * 0.12, 1.252 + i * 0.12, 128]} />
          <meshBasicMaterial
            color={i === 1 ? "#4CAF7D" : "#5EEAD4"}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Satellite() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.25;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * 1.8, Math.sin(t * 0.6) * 0.6, Math.sin(t) * 1.8);
      ref.current.lookAt(0, 0, 0);
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.035, 0.035, 0.06]} />
        <meshBasicMaterial color="#F2A65A" />
      </mesh>
      <mesh position={[0.05, 0, 0]}>
        <planeGeometry args={[0.05, 0.02]} />
        <meshBasicMaterial color="#3E7CB1" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.05, 0, 0]}>
        <planeGeometry args={[0.05, 0.02]} />
        <meshBasicMaterial color="#3E7CB1" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function Earth() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 3, 5]} intensity={1.2} color="#EDEFF2" />
      <Stars radius={80} depth={40} count={2500} factor={2} saturation={0} fade speed={0.4} />
      <Globe />
      <Satellite />
    </>
  );
}
