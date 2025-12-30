"use client";

import { useEffect, useRef, useState } from "react";
import { GestureDetector } from "@/ar-engine/gesture/gesture-detector";
import type { GestureDetectionResult, GestureTrigger } from "@/ar-engine/types";

export interface GestureDetectorProps {
  videoElement: HTMLVideoElement | null;
  triggers?: GestureTrigger[];
  onGestureDetected: (result: GestureDetectionResult) => void;
  enabled?: boolean;
}

export function GestureDetectorComponent({
  videoElement,
  triggers,
  onGestureDetected,
  enabled = true,
}: GestureDetectorProps) {
  const detectorRef = useRef<GestureDetector | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize detector
  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    async function init() {
      if (detectorRef.current?.isInitialized()) return;

      try {
        setInitializing(true);
        setError(null);

        const detector = new GestureDetector();
        await detector.initialize();

        if (!mounted) {
          detector.dispose();
          return;
        }

        detectorRef.current = detector;
        setInitialized(true);
        setInitializing(false);
      } catch (err) {
        if (!mounted) return;

        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize gesture detector";
        setError(errorMessage);
        setInitializing(false);
      }
    }

    init();

    return () => {
      mounted = false;
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };
  }, [enabled]);

  // Start/stop detection when video element changes
  useEffect(() => {
    if (!enabled || !initialized || !videoElement || !detectorRef.current) {
      return;
    }

    const detector = detectorRef.current;

    try {
      detector.start(videoElement, onGestureDetected);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start gesture detection";
      setError(errorMessage);
    }

    return () => {
      detector.stop();
    };
  }, [enabled, initialized, videoElement, onGestureDetected]);

  // This is a headless component - no UI
  if (!enabled) return null;

  // Optional: Show initialization status
  if (initializing) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
        Initializing gesture detection...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm max-w-xs">
        Gesture detection error: {error}
      </div>
    );
  }

  return null;
}
