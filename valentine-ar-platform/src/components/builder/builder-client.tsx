"use client";

import { useEffect } from "react";
import { Card as CardType, Template } from "@prisma/client";
import { useBuilder } from "./builder-provider";
import { BuilderSidebar } from "./builder-sidebar";
import { CardPreview } from "./card-preview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface BuilderClientProps {
  card: CardType & { template: Template };
}

export function BuilderClient({ card }: BuilderClientProps) {
  const { initializeBuilder, isSaving, lastSaved, error, saveCard } = useBuilder();

  useEffect(() => {
    // Initialize builder with card data
    initializeBuilder(card.id, {
      recipientName: card.recipientName,
      senderName: card.senderName,
      message: card.message,
      backgroundType: card.backgroundType,
      backgroundColor: card.backgroundColor,
      backgroundUrl: card.backgroundUrl,
      musicUrl: card.musicUrl,
      musicVolume: card.musicVolume,
      arEffects: card.arEffects as any,
      voiceTriggers: card.voiceTriggers as any,
      gestureTriggers: card.gestureTriggers as any,
    });
  }, [card, initializeBuilder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">Customize Your Card</h1>
                <p className="text-sm text-muted-foreground">{card.template.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Save status */}
              <div className="text-sm text-muted-foreground">
                {isSaving && "Saving..."}
                {!isSaving && lastSaved && `Saved ${formatTimeSince(lastSaved)}`}
                {error && <span className="text-red-500">{error}</span>}
              </div>

              <Button variant="outline" size="sm" onClick={saveCard} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Save Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sidebar with editors */}
          <div className="order-2 lg:order-1">
            <BuilderSidebar template={card.template} />
          </div>

          {/* Preview */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <CardPreview />
          </div>
        </div>
      </div>

      {/* Sticky mobile button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t lg:hidden z-50 safe-area-inset-bottom">
        <Button
          className="w-full bg-valentine-500 hover:bg-valentine-600 shadow-lg"
          onClick={saveCard}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>

      {/* Add padding at bottom for mobile to account for sticky button */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
