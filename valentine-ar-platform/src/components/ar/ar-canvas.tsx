"use client";

import { useState, useCallback } from "react";
import { CameraFeed } from "./camera-feed";
import { GestureDetectorComponent } from "./gesture-detector";
import { VoiceListenerComponent } from "./voice-listener";
import { EffectsRenderer } from "./effects-renderer";
import { CardOverlay } from "./card-overlay";
import { useARViewer } from "./ar-viewer-provider";
import {
  getEffectForGesture,
  getIntensityForGesture,
} from "@/ar-engine/gesture/gesture-events";
import {
  getEffectForVoiceCommand,
  getIntensityForVoiceCommand,
} from "@/ar-engine/voice/voice-commands";
import type {
  GestureDetectionResult,
  VoiceDetectionResult,
} from "@/ar-engine/types";

export interface ARCanvasProps {
  onClose?: () => void;
}

export function ARCanvas({ onClose }: ARCanvasProps) {
  const { cardData, activeEffects, triggerEffect } = useARViewer();
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleCameraReady = useCallback((video: HTMLVideoElement) => {
    setVideoElement(video);
  }, []);

  const handleGestureDetected = useCallback(
    (result: GestureDetectionResult) => {
      console.log("Gesture detected:", result.gesture);

      const effect = getEffectForGesture(
        result.gesture,
        cardData.gestureTriggers
      );

      if (effect) {
        const intensity = getIntensityForGesture(
          result.gesture,
          cardData.gestureTriggers
        );

        triggerEffect({
          type: effect,
          intensity,
        });
      }
    },
    [cardData.gestureTriggers, triggerEffect]
  );

  const handleVoiceDetected = useCallback(
    (result: VoiceDetectionResult) => {
      console.log("Voice detected:", result.phrase);

      const effect = getEffectForVoiceCommand(
        result.phrase,
        cardData.voiceTriggers
      );

      if (effect) {
        const intensity = getIntensityForVoiceCommand(
          result.phrase,
          cardData.voiceTriggers
        );

        triggerEffect({
          type: effect,
          intensity,
        });
      }
    },
    [cardData.voiceTriggers, triggerEffect]
  );

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Camera feed background */}
      <div className="absolute inset-0">
        <CameraFeed
          facingMode="user"
          onReady={handleCameraReady}
          className="w-full h-full"
        />
      </div>

      {/* Effects overlay */}
      <div className="absolute inset-0">
        <EffectsRenderer effects={activeEffects} className="w-full h-full" />
      </div>

      {/* Card overlay */}
      <CardOverlay onClose={onClose} />

      {/* Gesture detector (headless) */}
      <GestureDetectorComponent
        videoElement={videoElement}
        triggers={cardData.gestureTriggers}
        onGestureDetected={handleGestureDetected}
        enabled={gestureEnabled}
      />

      {/* Voice listener (headless) */}
      <VoiceListenerComponent
        commands={cardData.voiceTriggers}
        onVoiceDetected={handleVoiceDetected}
        enabled={voiceEnabled}
      />
    </div>
  );
}
