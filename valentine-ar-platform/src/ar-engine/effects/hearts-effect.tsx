/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EffectConfig } from "../types";

export interface HeartsEffectProps {
  active: boolean;
  config: EffectConfig;
}

export function HeartsEffect({ active, config }: HeartsEffectProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = config.particleCount || 50;
  const color = config.color || "#ff69b4";
  const intensity = config.intensity || 0.5;

  // Create particle geometry and attributes
  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Random initial position
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = -3 + Math.random() * 2;
      positions[i3 + 2] = -2;

      // Velocity (upward with slight horizontal sway)
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = 0.02 + Math.random() * 0.03;
      velocities[i3 + 2] = 0;

      // Size
      sizes[i] = 0.1 + Math.random() * 0.15;
    }

    return { positions, velocities, sizes };
  }, [particleCount]);

  // Animation loop
  useFrame((state) => {
    if (!active || !particlesRef.current) return;

    const positions =
      particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Update position
      positions[i3] += velocities[i3] + Math.sin(time + i) * 0.005; // Sway
      positions[i3 + 1] += velocities[i3 + 1]; // Up
      positions[i3 + 2] += velocities[i3 + 2];

      // Reset particle when it goes off screen
      if (positions[i3 + 1] > 3) {
        positions[i3] = (Math.random() - 0.5) * 4;
        positions[i3 + 1] = -3;
        positions[i3 + 2] = -2;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    // @ts-ignore - React Three Fiber elements
    <points ref={particlesRef}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* @ts-ignore */}
      <pointsMaterial
        size={0.2 * intensity}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    {/* @ts-ignore */}
    </points>
  );
}
