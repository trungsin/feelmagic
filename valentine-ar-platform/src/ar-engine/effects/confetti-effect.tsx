/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EffectConfig } from "../types";

export interface ConfettiEffectProps {
  active: boolean;
  config: EffectConfig;
}

export function ConfettiEffect({ active, config }: ConfettiEffectProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = config.particleCount || 80;
  const intensity = config.intensity || 0.5;

  // Confetti colors
  const colors = useMemo(
    () => [
      new THREE.Color("#ff69b4"), // Pink
      new THREE.Color("#ffd700"), // Gold
      new THREE.Color("#00bfff"), // Sky blue
      new THREE.Color("#ff6347"), // Tomato
      new THREE.Color("#9370db"), // Purple
      new THREE.Color("#32cd32"), // Lime green
    ],
    []
  );

  // Create particle geometry and attributes
  const { positions, velocities, rotations, colorArray } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const rotations = new Float32Array(particleCount);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Start from center, spread outward
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = 2 + Math.random();
      positions[i3 + 2] = -2;

      // Velocity (outward and downward)
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.02 + Math.random() * 0.03;
      velocities[i3] = Math.cos(angle) * speed;
      velocities[i3 + 1] = -0.02 - Math.random() * 0.03; // Fall
      velocities[i3 + 2] = Math.sin(angle) * speed * 0.5;

      // Random rotation
      rotations[i] = Math.random() * Math.PI * 2;

      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      colorArray[i3] = color.r;
      colorArray[i3 + 1] = color.g;
      colorArray[i3 + 2] = color.b;
    }

    return { positions, velocities, rotations, colorArray };
  }, [particleCount, colors]);

  // Animation loop
  useFrame((state) => {
    if (!active || !particlesRef.current) return;

    const positions =
      particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Update position with gravity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Add rotation effect (sway while falling)
      positions[i3] += Math.sin(time + rotations[i]) * 0.002;

      // Apply gravity
      velocities[i3 + 1] -= 0.001;

      // Reset particle when it goes off screen
      if (positions[i3 + 1] < -3) {
        positions[i3] = (Math.random() - 0.5) * 2;
        positions[i3 + 1] = 2 + Math.random();
        positions[i3 + 2] = -2;

        const angle = Math.random() * Math.PI * 2;
        const speed = 0.02 + Math.random() * 0.03;
        velocities[i3] = Math.cos(angle) * speed;
        velocities[i3 + 1] = -0.02 - Math.random() * 0.03;
        velocities[i3 + 2] = Math.sin(angle) * speed * 0.5;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    // @ts-ignore
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
          attach="attributes-color"
          count={particleCount}
          array={colorArray}
          itemSize={3}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* @ts-ignore */}
      <pointsMaterial
        size={0.15 * intensity}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    {/* @ts-ignore */}
    </points>
  );
}
