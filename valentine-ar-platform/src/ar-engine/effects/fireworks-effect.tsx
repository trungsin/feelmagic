/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EffectConfig } from "../types";

export interface FireworksEffectProps {
  active: boolean;
  config: EffectConfig;
}

interface Firework {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  exploded: boolean;
  lifetime: number;
  particles: {
    positions: Float32Array;
    velocities: Float32Array;
    life: Float32Array;
  };
}

export function FireworksEffect({ active, config }: FireworksEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const intensity = config.intensity || 0.5;
  const particlesPerFirework = 50;

  // Spawn fireworks periodically
  useEffect(() => {
    if (!active) {
      setFireworks([]);
      return;
    }

    const spawnInterval = setInterval(() => {
      const newFirework = createFirework();
      setFireworks((prev) => [...prev, newFirework]);
    }, 500);

    return () => clearInterval(spawnInterval);
  }, [active]);

  function createFirework(): Firework {
    const positions = new Float32Array(particlesPerFirework * 3);
    const velocities = new Float32Array(particlesPerFirework * 3);
    const life = new Float32Array(particlesPerFirework);

    for (let i = 0; i < particlesPerFirework; i++) {
      const i3 = i * 3;

      // Start at explosion point
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      // Random velocity in all directions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.03 + Math.random() * 0.05;

      velocities[i3] = speed * Math.sin(phi) * Math.cos(theta);
      velocities[i3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      velocities[i3 + 2] = speed * Math.cos(phi);

      life[i] = 1.0;
    }

    return {
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        -2,
        -2
      ),
      velocity: new THREE.Vector3(0, 0.08, 0),
      exploded: false,
      lifetime: 0,
      particles: { positions, velocities, life },
    };
  }

  // Animation loop
  useFrame(() => {
    if (!active) return;

    setFireworks((prev) =>
      prev
        .map((firework) => {
          firework.lifetime += 0.016;

          if (!firework.exploded) {
            // Rising phase
            firework.position.add(firework.velocity);
            firework.velocity.y -= 0.002; // Gravity

            // Explode after reaching peak
            if (firework.velocity.y <= 0) {
              firework.exploded = true;
            }
          } else {
            // Explosion phase
            const { positions, velocities, life } = firework.particles;

            for (let i = 0; i < particlesPerFirework; i++) {
              const i3 = i * 3;

              // Update positions
              positions[i3] += velocities[i3];
              positions[i3 + 1] += velocities[i3 + 1];
              positions[i3 + 2] += velocities[i3 + 2];

              // Apply gravity
              velocities[i3 + 1] -= 0.001;

              // Fade out
              life[i] -= 0.02;
            }
          }

          return firework;
        })
        .filter((fw) => fw.lifetime < 3) // Remove old fireworks
    );
  });

  if (!active) return null;

  return (
    // @ts-ignore
    <group ref={groupRef}>
      {fireworks.map((firework, idx) =>
        firework.exploded ? (
          // @ts-ignore
          <points key={idx} position={firework.position}>
            {/* @ts-ignore */}
            <bufferGeometry>
              {/* @ts-ignore */}
              <bufferAttribute
                attach="attributes-position"
                count={particlesPerFirework}
                array={firework.particles.positions}
                itemSize={3}
              />
              {/* @ts-ignore */}
              <bufferAttribute
                attach="attributes-life"
                count={particlesPerFirework}
                array={firework.particles.life}
                itemSize={1}
              />
            {/* @ts-ignore */}
            </bufferGeometry>
            {/* @ts-ignore */}
            <pointsMaterial
              size={0.15 * intensity}
              color={config.color || "#ffd700"}
              transparent
              opacity={0.9}
              sizeAttenuation
              depthWrite={false}
            />
          {/* @ts-ignore */}
          </points>
        ) : null
      )}
    {/* @ts-ignore */}
    </group>
  );
}
