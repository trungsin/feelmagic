"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { CardCustomization } from "@/lib/validations/card";
import { BackgroundType } from "@prisma/client";

interface BuilderContextType {
  cardId: string | null;
  customization: CardCustomization;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  updateCustomization: (updates: Partial<CardCustomization>) => void;
  saveCard: () => Promise<void>;
  initializeBuilder: (cardId: string, initialData: CardCustomization) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within BuilderProvider");
  }
  return context;
}

const DEFAULT_CUSTOMIZATION: CardCustomization = {
  recipientName: "",
  senderName: "",
  message: "",
  backgroundType: BackgroundType.IMAGE,
  backgroundColor: null,
  backgroundUrl: null,
  musicUrl: null,
  musicVolume: 0.5,
  arEffects: [],
  voiceTriggers: [],
  gestureTriggers: [],
};

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [cardId, setCardId] = useState<string | null>(null);
  const [customization, setCustomization] = useState<CardCustomization>(DEFAULT_CUSTOMIZATION);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveCard = useCallback(async () => {
    if (!cardId) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/builder/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId,
          ...customization,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save card");
      }

      setLastSaved(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save card";
      setError(message);
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [cardId, customization]);

  const updateCustomization = useCallback((updates: Partial<CardCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...updates }));

    // Auto-save with debounce (2.5 seconds)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveCard();
    }, 2500);
  }, [saveCard]);

  const initializeBuilder = useCallback((id: string, initialData: CardCustomization) => {
    setCardId(id);
    setCustomization(initialData);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const value: BuilderContextType = {
    cardId,
    customization,
    isLoading: false,
    isSaving,
    lastSaved,
    error,
    updateCustomization,
    saveCard,
    initializeBuilder,
  };

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}
