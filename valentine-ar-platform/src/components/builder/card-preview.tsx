"use client";

import { useBuilder } from "./builder-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Music, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function CardPreview() {
  const { customization } = useBuilder();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state when background changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [customization.backgroundType, customization.backgroundUrl, customization.backgroundColor]);

  const activeEffects = customization.arEffects.filter(e => e.enabled);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Preview card visual */}
        <div
          className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 bg-muted"
          style={{
            backgroundColor: !isLoading && customization.backgroundType === "COLOR"
              ? customization.backgroundColor || "#ff69b4"
              : undefined,
          }}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Updating preview...</p>
              </div>
            </div>
          ) : (
            <>
              {customization.backgroundType === "IMAGE" && customization.backgroundUrl && (
                <img
                  src={customization.backgroundUrl}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              )}

              {customization.backgroundType === "VIDEO" && customization.backgroundUrl && (
                <div className="w-full h-full flex items-center justify-center bg-black/5">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-sm text-muted-foreground">Video Background</p>
                  </div>
                </div>
              )}

              {/* Overlay with text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/30 text-white">
                {customization.recipientName && (
                  <p className="text-sm font-medium mb-2">To: {customization.recipientName}</p>
                )}

                {customization.message && (
                  <div className="max-w-xs">
                    <p className="text-sm italic line-clamp-4 mb-4">
                      &ldquo;{customization.message}&rdquo;
                    </p>
                  </div>
                )}

                {customization.senderName && (
                  <p className="text-sm font-medium">From: {customization.senderName}</p>
                )}

                {!customization.recipientName && !customization.message && !customization.senderName && (
                  <p className="text-sm text-white/80">
                    Your customized card will appear here
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Details section */}
        <div className="space-y-4">
          {/* Music */}
          {customization.musicUrl && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <Music className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Background Music</p>
                <p className="text-xs text-muted-foreground truncate">
                  {customization.musicUrl}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Volume: {Math.round(customization.musicVolume * 100)}%
                </p>
              </div>
            </div>
          )}

          {/* AR Effects */}
          {activeEffects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Active Effects</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeEffects.map((effect, idx) => (
                  <Badge key={idx} variant="secondary">
                    {effect.type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Voice Triggers */}
          {customization.voiceTriggers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">🎤 Voice Triggers</p>
              <div className="space-y-1">
                {customization.voiceTriggers.map((trigger, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground">
                    &ldquo;{trigger.phrase}&rdquo; → {trigger.effect}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gesture Triggers */}
          {customization.gestureTriggers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">👋 Gesture Triggers</p>
              <div className="space-y-1">
                {customization.gestureTriggers.map((trigger, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground">
                    {trigger.gesture} → {trigger.effect}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview AR button (Phase 5) */}
        <Button className="w-full" variant="outline" disabled>
          <Eye className="h-4 w-4 mr-2" />
          Preview in AR (Coming Soon)
        </Button>
      </CardContent>
    </Card>
  );
}
