"use client";

import { useEffect, useRef, useState } from "react";
import { VoiceListener } from "@/ar-engine/voice/voice-listener";
import type { VoiceDetectionResult, VoiceTrigger } from "@/ar-engine/types";

export interface VoiceListenerProps {
  commands: VoiceTrigger[];
  onVoiceDetected: (result: VoiceDetectionResult) => void;
  enabled?: boolean;
}

export function VoiceListenerComponent({
  commands,
  onVoiceDetected,
  enabled = true,
}: VoiceListenerProps) {
  const listenerRef = useRef<VoiceListener | null>(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check support on mount
  useEffect(() => {
    setSupported(VoiceListener.isSupported());
  }, []);

  // Initialize listener
  useEffect(() => {
    if (!enabled || !supported) return;

    try {
      const listener = new VoiceListener();
      listener.initialize(commands);
      listenerRef.current = listener;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize voice listener";
      setError(errorMessage);
    }

    return () => {
      if (listenerRef.current) {
        listenerRef.current.dispose();
        listenerRef.current = null;
      }
    };
  }, [enabled, supported, commands]);

  // Start/stop listening
  useEffect(() => {
    if (!enabled || !supported || !listenerRef.current) {
      return;
    }

    try {
      listenerRef.current.start(onVoiceDetected);
      setListening(true);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start voice listener";
      setError(errorMessage);
      setListening(false);
    }

    return () => {
      if (listenerRef.current) {
        listenerRef.current.stop();
        setListening(false);
      }
    };
  }, [enabled, supported, onVoiceDetected]);

  // Update commands when they change
  useEffect(() => {
    if (listenerRef.current) {
      listenerRef.current.updateCommands(commands);
    }
  }, [commands]);

  // This is a headless component - no UI
  if (!enabled) return null;

  // Show unsupported message
  if (!supported) {
    return (
      <div className="fixed bottom-4 left-4 bg-yellow-500/90 text-white px-4 py-2 rounded-lg text-sm max-w-xs">
        Voice commands not supported in this browser. Try Chrome or Edge.
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="fixed bottom-4 left-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm max-w-xs">
        Voice error: {error}
      </div>
    );
  }

  // Show listening indicator
  if (listening) {
    return (
      <div className="fixed bottom-4 left-4 bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        Listening...
      </div>
    );
  }

  return null;
}
