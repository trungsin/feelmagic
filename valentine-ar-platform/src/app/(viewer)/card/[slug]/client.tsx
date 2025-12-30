"use client";

import { ARViewerProvider } from "@/components/ar/ar-viewer-provider";
import { ARCanvas } from "@/components/ar/ar-canvas";
import type { GestureTrigger, VoiceTrigger, AREffect } from "@/ar-engine/types";

interface CardData {
  id: string;
  slug: string;
  recipientName: string;
  senderName: string;
  message: string;
  backgroundType: string;
  backgroundColor: string | null;
  backgroundUrl: string | null;
  musicUrl: string | null;
  musicVolume: number;
  arEffects: unknown;
  voiceTriggers: unknown;
  gestureTriggers: unknown;
  viewCount: number;
}

export function ARViewerClient({ cardData }: { cardData: CardData }) {
  // Parse JSON fields with type safety
  const gestureTriggers = Array.isArray(cardData.gestureTriggers)
    ? (cardData.gestureTriggers as GestureTrigger[])
    : [];

  const voiceTriggers = Array.isArray(cardData.voiceTriggers)
    ? (cardData.voiceTriggers as VoiceTrigger[])
    : [];

  const arEffects = Array.isArray(cardData.arEffects)
    ? (cardData.arEffects as AREffect[])
    : [];

  const providerData = {
    recipientName: cardData.recipientName,
    senderName: cardData.senderName,
    message: cardData.message,
    musicUrl: cardData.musicUrl || undefined,
    musicVolume: cardData.musicVolume,
    gestureTriggers,
    voiceTriggers,
    arEffects,
  };

  return (
    <ARViewerProvider cardData={providerData}>
      <ARCanvas />
    </ARViewerProvider>
  );
}
