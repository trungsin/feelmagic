"use client";

import { useBuilder } from "./builder-provider";
import { AREffect, EFFECT_TYPES } from "@/lib/validations/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface EffectsPanelProps {
  availableEffects: string[];
}

const EFFECT_LABELS: Record<string, string> = {
  hearts: "❤️ Hearts",
  fireworks: "🎆 Fireworks",
  glow: "✨ Glow",
  confetti: "🎊 Confetti",
};

const COLOR_SUPPORTED_EFFECTS = ["hearts", "glow"];

export function EffectsPanel({ availableEffects }: EffectsPanelProps) {
  const { customization, updateCustomization } = useBuilder();

  // Use availableEffects from template if provided, otherwise show all
  const effectsList = availableEffects.length > 0 ? availableEffects : EFFECT_TYPES;

  const toggleEffect = (effectType: string) => {
    const currentEffects = customization.arEffects;
    const existingEffect = currentEffects.find((e) => e.type === effectType);

    if (existingEffect) {
      // Toggle enabled state
      const updatedEffects = currentEffects.map((e) =>
        e.type === effectType ? { ...e, enabled: !e.enabled } : e
      );
      updateCustomization({ arEffects: updatedEffects });
    } else {
      // Add new effect
      const newEffect: AREffect = {
        type: effectType as any,
        intensity: 0.8,
        enabled: true,
        color: COLOR_SUPPORTED_EFFECTS.includes(effectType) ? "#ff69b4" : undefined,
      };
      updateCustomization({ arEffects: [...currentEffects, newEffect] });
    }
  };

  const updateEffectIntensity = (effectType: string, intensity: number) => {
    const updatedEffects = customization.arEffects.map((e) =>
      e.type === effectType ? { ...e, intensity } : e
    );
    updateCustomization({ arEffects: updatedEffects });
  };

  const updateEffectColor = (effectType: string, color: string) => {
    const updatedEffects = customization.arEffects.map((e) =>
      e.type === effectType ? { ...e, color } : e
    );
    updateCustomization({ arEffects: updatedEffects });
  };

  const getEffect = (effectType: string): AREffect | undefined => {
    return customization.arEffects.find((e) => e.type === effectType);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>AR Effects</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Choose which effects to display in AR view
        </p>
      </div>

      <div className="space-y-4">
        {effectsList.map((effectType) => {
          const effect = getEffect(effectType);
          const isActive = effect?.enabled || false;

          return (
            <div key={effectType} className="space-y-3 p-4 rounded-lg border bg-card">
              {/* Effect toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleEffect(effectType)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input"
                    }`}
                  >
                    {isActive && (
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">
                    {EFFECT_LABELS[effectType] || effectType}
                  </span>
                </button>
                {isActive && <Badge variant="secondary">Active</Badge>}
              </div>

              {/* Effect controls (only show when active) */}
              {isActive && effect && (
                <div className="space-y-3 pl-7">
                  {/* Intensity slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Intensity</Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(effect.intensity * 100)}%
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[effect.intensity]}
                      onValueChange={(value: number[]) =>
                        updateEffectIntensity(effectType, value[0])
                      }
                    />
                  </div>

                  {/* Color picker (for effects that support it) */}
                  {COLOR_SUPPORTED_EFFECTS.includes(effectType) && (
                    <div className="space-y-2">
                      <Label className="text-xs">Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={effect.color || "#ff69b4"}
                          onChange={(e) =>
                            updateEffectColor(effectType, e.target.value)
                          }
                          className="h-10 w-16 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={effect.color || "#ff69b4"}
                          onChange={(e) =>
                            updateEffectColor(effectType, e.target.value)
                          }
                          placeholder="#ff69b4"
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
