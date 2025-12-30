"use client";

import { useState } from "react";
import { useBuilder } from "./builder-provider";
import { GestureTrigger, GESTURE_TYPES, GESTURE_LABELS, EFFECT_TYPES } from "@/lib/validations/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Hand } from "lucide-react";

const EFFECT_EMOJIS: Record<string, string> = {
  hearts: "❤️",
  fireworks: "🎆",
  glow: "✨",
  confetti: "🎊",
};

export function GestureTriggersEditor() {
  const { customization, updateCustomization } = useBuilder();
  const [newGesture, setNewGesture] = useState<string>(GESTURE_TYPES[0]);
  const [newEffect, setNewEffect] = useState<string>(EFFECT_TYPES[0]);

  const addTrigger = () => {
    if (customization.gestureTriggers.length >= 5) return;

    // Check if gesture already exists
    const exists = customization.gestureTriggers.some(
      (t) => t.gesture === newGesture
    );
    if (exists) return;

    const newTrigger: GestureTrigger = {
      gesture: newGesture as any,
      effect: newEffect as any,
    };

    updateCustomization({
      gestureTriggers: [...customization.gestureTriggers, newTrigger],
    });

    // Reset to next available gesture
    const usedGestures = [...customization.gestureTriggers.map(t => t.gesture), newGesture];
    const nextGesture = GESTURE_TYPES.find(g => !usedGestures.includes(g));
    if (nextGesture) {
      setNewGesture(nextGesture);
    }
  };

  const removeTrigger = (index: number) => {
    const updatedTriggers = customization.gestureTriggers.filter((_, i) => i !== index);
    updateCustomization({ gestureTriggers: updatedTriggers });
  };

  // Get available gestures (not yet used)
  const usedGestures = customization.gestureTriggers.map(t => t.gesture);
  const availableGestures = GESTURE_TYPES.filter(g => !usedGestures.includes(g));

  return (
    <div className="space-y-4">
      <div>
        <Label>Gesture Triggers</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Map hand gestures to AR effects (max 5)
        </p>
      </div>

      {/* Current triggers */}
      {customization.gestureTriggers.length > 0 && (
        <div className="space-y-2">
          {customization.gestureTriggers.map((trigger, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg border bg-card"
            >
              <Hand className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{GESTURE_LABELS[trigger.gesture]}</p>
                <p className="text-xs text-muted-foreground">
                  Triggers: {EFFECT_EMOJIS[trigger.effect]} {trigger.effect}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTrigger(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add new trigger */}
      {customization.gestureTriggers.length < 5 && availableGestures.length > 0 && (
        <div className="space-y-3 p-4 rounded-lg border-2 border-dashed">
          <div className="space-y-2">
            <Label htmlFor="gesture">Hand Gesture</Label>
            <Select value={newGesture} onValueChange={setNewGesture}>
              <SelectTrigger id="gesture">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableGestures.map((gesture) => (
                  <SelectItem key={gesture} value={gesture}>
                    {GESTURE_LABELS[gesture]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gesture-effect">Trigger Effect</Label>
            <Select value={newEffect} onValueChange={setNewEffect}>
              <SelectTrigger id="gesture-effect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EFFECT_TYPES.map((effect) => (
                  <SelectItem key={effect} value={effect}>
                    {EFFECT_EMOJIS[effect]} {effect}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={addTrigger}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Gesture Trigger
          </Button>
        </div>
      )}

      {customization.gestureTriggers.length >= 5 && (
        <div className="p-3 rounded-lg bg-muted text-sm text-center">
          Maximum gesture triggers reached (5/5)
        </div>
      )}

      {customization.gestureTriggers.length < 5 && availableGestures.length === 0 && (
        <div className="p-3 rounded-lg bg-muted text-sm text-center">
          All gestures are already mapped
        </div>
      )}
    </div>
  );
}
