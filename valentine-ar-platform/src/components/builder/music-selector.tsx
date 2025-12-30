"use client";

import { useState, useRef } from "react";
import { useBuilder } from "./builder-provider";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music } from "lucide-react";

interface MusicSelectorProps {
  availableMusic: string[];
}

// Sample music tracks (placeholder URLs)
const DEFAULT_MUSIC = [
  { url: "https://example.com/music/romantic-1.mp3", name: "Romantic Melody" },
  { url: "https://example.com/music/sweet-love.mp3", name: "Sweet Love" },
  { url: "https://example.com/music/valentine-dreams.mp3", name: "Valentine Dreams" },
];

export function MusicSelector({ availableMusic }: MusicSelectorProps) {
  const { customization, updateCustomization } = useBuilder();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use availableMusic from template if provided, otherwise use defaults
  const musicTracks = availableMusic.length > 0
    ? availableMusic.map((url, idx) => ({
        url,
        name: `Music Track ${idx + 1}`,
      }))
    : DEFAULT_MUSIC;

  const handleMusicSelect = (url: string) => {
    updateCustomization({ musicUrl: url });
  };

  const handleVolumeChange = (value: number[]) => {
    updateCustomization({ musicVolume: value[0] });
  };

  const togglePreview = (url: string) => {
    if (currentPreview === url && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setCurrentPreview(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentPreview(url);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label>Background Music</Label>

      {/* Music tracks list */}
      <div className="space-y-2">
        {musicTracks.map((track, idx) => (
          <button
            key={idx}
            onClick={() => handleMusicSelect(track.url)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
              customization.musicUrl === track.url
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{track.name}</p>
              <p className="text-xs text-muted-foreground truncate">{track.url}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                togglePreview(track.url);
              }}
            >
              {currentPreview === track.url && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </button>
        ))}
      </div>

      {/* Volume control */}
      {customization.musicUrl && (
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label htmlFor="volume">Volume</Label>
            <span className="text-sm text-muted-foreground">
              {Math.round(customization.musicVolume * 100)}%
            </span>
          </div>
          <Slider
            id="volume"
            min={0}
            max={1}
            step={0.1}
            value={[customization.musicVolume]}
            onValueChange={handleVolumeChange}
          />
        </div>
      )}

      {/* Hidden audio element for preview */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentPreview(null);
        }}
      />

      <p className="text-xs text-muted-foreground">
        This music will play when viewing the AR card
      </p>
    </div>
  );
}
