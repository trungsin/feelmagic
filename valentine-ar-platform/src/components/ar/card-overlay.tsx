"use client";

import { useState } from "react";
import { useARViewer } from "./ar-viewer-provider";
import { Volume2, VolumeX, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CardOverlayProps {
  onClose?: () => void;
}

export function CardOverlay({ onClose }: CardOverlayProps) {
  const {
    cardData,
    musicPlaying,
    setMusicPlaying,
    musicVolume,
    setMusicVolume,
  } = useARViewer();

  const [showContent, setShowContent] = useState(true);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Valentine Card from ${cardData.senderName}`,
          text: cardData.message,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const toggleContent = () => {
    setShowContent((prev) => !prev);
  };

  return (
    <>
      {/* Top overlay - card content */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center text-white">
          <p className="text-sm opacity-80">To</p>
          <h2 className="text-2xl font-bold mb-2">{cardData.recipientName}</h2>
          <p className="text-base max-w-md mx-auto leading-relaxed">
            {cardData.message}
          </p>
          <p className="text-sm mt-3 opacity-80">
            From {cardData.senderName} ❤️
          </p>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          {/* Music control */}
          {cardData.musicUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setMusicPlaying(!musicPlaying)}
            >
              {musicPlaying ? (
                <Volume2 className="h-6 w-6" />
              ) : (
                <VolumeX className="h-6 w-6" />
              )}
            </Button>
          )}

          {/* Center tap hint */}
          <button
            onClick={toggleContent}
            className="flex-1 text-center text-white/60 text-sm"
          >
            {showContent ? "Tap to hide" : "Tap to show message"}
          </button>

          {/* Share button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleShare}
          >
            <Share2 className="h-6 w-6" />
          </Button>

          {/* Close button */}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 ml-2"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Gesture hints */}
        <div className="mt-4 text-center">
          <p className="text-white/60 text-xs">
            Try gestures: ✌️ Victory • 👋 Wave • 👍 Thumbs up
          </p>
          <p className="text-white/60 text-xs mt-1">
            Or say: &quot;I love you&quot; • &quot;Happy Valentine&quot;
          </p>
        </div>
      </div>
    </>
  );
}
