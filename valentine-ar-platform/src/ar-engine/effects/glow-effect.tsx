/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EffectConfig } from "../types";

export interface GlowEffectProps {
  active: boolean;
  config: EffectConfig;
}

export function GlowEffect({ active, config }: GlowEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [opacity, setOpacity] = useState(0);
  const color = config.color || "#ff69b4";
  const intensity = config.intensity || 0.5;

  // Fade in/out
  useEffect(() => {
    if (active) {
      setOpacity(0);
      const fadeIn = setInterval(() => {
        setOpacity((prev) => Math.min(prev + 0.05, intensity * 0.4));
      }, 16);

      return () => clearInterval(fadeIn);
    } else {
      const fadeOut = setInterval(() => {
        setOpacity((prev) => {
          const newOpacity = Math.max(prev - 0.05, 0);
          if (newOpacity === 0) clearInterval(fadeOut);
          return newOpacity;
        });
      }, 16);

      return () => clearInterval(fadeOut);
    }
  }, [active, intensity]);

  // Pulsing animation
  useFrame((state) => {
    if (!meshRef.current || !active) return;

    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
    meshRef.current.scale.setScalar(pulse);
  });

  if (opacity === 0) return null;

  return (
    // @ts-ignore
    <mesh ref={meshRef} position={[0, 0, -3]}>
      {/* @ts-ignore */}
      <planeGeometry args={[10, 10]} />
      {/* @ts-ignore */}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    {/* @ts-ignore */}
    </mesh>
  );
}
