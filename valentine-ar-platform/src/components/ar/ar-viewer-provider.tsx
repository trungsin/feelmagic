"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { EffectManager, type ActiveEffect } from "@/ar-engine/effects/effect-manager";
import type {
  AREffect,
  GestureTrigger,
  VoiceTrigger,
} from "@/ar-engine/types";

interface CardData {
  recipientName: string;
  senderName: string;
  message: string;
  musicUrl?: string;
  musicVolume: number;
  gestureTriggers: GestureTrigger[];
  voiceTriggers: VoiceTrigger[];
  arEffects: AREffect[];
}

interface ARViewerContextValue {
  cardData: CardData;
  activeEffects: ActiveEffect[];
  triggerEffect: (effect: AREffect) => void;
  musicPlaying: boolean;
  setMusicPlaying: (playing: boolean) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
}

const ARViewerContext = createContext<ARViewerContextValue | null>(null);

export interface ARViewerProviderProps {
  cardData: CardData;
  children: ReactNode;
}

export function ARViewerProvider({ cardData, children }: ARViewerProviderProps) {
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(cardData.musicVolume);
  const effectManagerRef = useRef<EffectManager | null>(null);

  // Initialize effect manager
  useEffect(() => {
    const manager = new EffectManager();
    manager.start((effects) => {
      setActiveEffects(effects);
    });
    effectManagerRef.current = manager;

    return () => {
      manager.dispose();
    };
  }, []);

  const triggerEffect = useCallback((effect: AREffect) => {
    if (effectManagerRef.current) {
      effectManagerRef.current.triggerEffect(effect);
    }
  }, []);

  const value: ARViewerContextValue = {
    cardData,
    activeEffects,
    triggerEffect,
    musicPlaying,
    setMusicPlaying,
    musicVolume,
    setMusicVolume,
  };

  return (
    <ARViewerContext.Provider value={value}>
      {children}
    </ARViewerContext.Provider>
  );
}

export function useARViewer() {
  const context = useContext(ARViewerContext);
  if (!context) {
    throw new Error("useARViewer must be used within ARViewerProvider");
  }
  return context;
}
