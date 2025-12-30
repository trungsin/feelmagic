"use client";

import { useState } from "react";
import { useBuilder } from "./builder-provider";
import { VoiceTrigger, EFFECT_TYPES } from "@/lib/validations/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Mic } from "lucide-react";

const EFFECT_EMOJIS: Record<string, string> = {
  hearts: "❤️",
  fireworks: "🎆",
  glow: "✨",
  confetti: "🎊",
};

export function VoiceTriggersEditor() {
  const { customization, updateCustomization } = useBuilder();
  const [newPhrase, setNewPhrase] = useState("");
  const [newEffect, setNewEffect] = useState<string>(EFFECT_TYPES[0]);

  const addTrigger = () => {
    if (!newPhrase.trim()) return;
    if (customization.voiceTriggers.length >= 5) return;

    const newTrigger: VoiceTrigger = {
      phrase: newPhrase.trim(),
      effect: newEffect as any,
    };

    updateCustomization({
      voiceTriggers: [...customization.voiceTriggers, newTrigger],
    });

    setNewPhrase("");
    setNewEffect(EFFECT_TYPES[0]);
  };

  const removeTrigger = (index: number) => {
    const updatedTriggers = customization.voiceTriggers.filter((_, i) => i !== index);
    updateCustomization({ voiceTriggers: updatedTriggers });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Voice Triggers</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Map voice commands to AR effects (max 5)
        </p>
      </div>

      {/* Current triggers */}
      {customization.voiceTriggers.length > 0 && (
        <div className="space-y-2">
          {customization.voiceTriggers.map((trigger, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg border bg-card"
            >
              <Mic className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{trigger.phrase}</p>
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
      {customization.voiceTriggers.length < 5 && (
        <div className="space-y-3 p-4 rounded-lg border-2 border-dashed">
          <div className="space-y-2">
            <Label htmlFor="phrase">Voice Phrase</Label>
            <Input
              id="phrase"
              placeholder='e.g., "I love you"'
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value.slice(0, 50))}
              maxLength={50}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTrigger();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effect">Trigger Effect</Label>
            <Select value={newEffect} onValueChange={setNewEffect}>
              <SelectTrigger id="effect">
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
            disabled={!newPhrase.trim()}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Voice Trigger
          </Button>
        </div>
      )}

      {customization.voiceTriggers.length >= 5 && (
        <div className="p-3 rounded-lg bg-muted text-sm text-center">
          Maximum voice triggers reached (5/5)
        </div>
      )}
    </div>
  );
}
