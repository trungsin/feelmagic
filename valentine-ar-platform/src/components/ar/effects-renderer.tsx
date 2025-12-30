"use client";

import { Canvas } from "@react-three/fiber";
import { HeartsEffect } from "@/ar-engine/effects/hearts-effect";
import { FireworksEffect } from "@/ar-engine/effects/fireworks-effect";
import { GlowEffect } from "@/ar-engine/effects/glow-effect";
import { ConfettiEffect } from "@/ar-engine/effects/confetti-effect";
import type { ActiveEffect } from "@/ar-engine/effects/effect-manager";

export interface EffectsRendererProps {
  effects: ActiveEffect[];
  className?: string;
}

export function EffectsRenderer({ effects, className = "" }: EffectsRendererProps) {
  const heartsEffects = effects.filter((e) => e.type === "hearts");
  const fireworksEffects = effects.filter((e) => e.type === "fireworks");
  const glowEffects = effects.filter((e) => e.type === "glow");
  const confettiEffects = effects.filter((e) => e.type === "confetti");

  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Hearts effects */}
        {heartsEffects.map((effect) => (
          <HeartsEffect
            key={effect.id}
            active={true}
            config={effect.config}
          />
        ))}

        {/* Fireworks effects */}
        {fireworksEffects.map((effect) => (
          <FireworksEffect
            key={effect.id}
            active={true}
            config={effect.config}
          />
        ))}

        {/* Glow effects */}
        {glowEffects.map((effect) => (
          <GlowEffect
            key={effect.id}
            active={true}
            config={effect.config}
          />
        ))}

        {/* Confetti effects */}
        {confettiEffects.map((effect) => (
          <ConfettiEffect
            key={effect.id}
            active={true}
            config={effect.config}
          />
        ))}
      </Canvas>
    </div>
  );
}
