"use client";

import { useState, useRef, useMemo } from "react";
import { useBuilder } from "./builder-provider";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Music, Search, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MusicSelectorProps {
  availableMusic: string[];
}

// Sample music tracks (placeholder URLs)
const DEFAULT_MUSIC = [
  { url: "https://example.com/music/romantic-1.mp3", name: "Romantic Melody", category: "Romantic" },
  { url: "https://example.com/music/sweet-love.mp3", name: "Sweet Love", category: "Pop" },
  { url: "https://example.com/music/valentine-dreams.mp3", name: "Valentine Dreams", category: "Dreamy" },
  { url: "https://example.com/music/piano-love.mp3", name: "Piano Love", category: "Classical" },
  { url: "https://example.com/music/upbeat-heart.mp3", name: "Upbeat Heart", category: "Pop" },
  { url: "https://example.com/music/jazz-night.mp3", name: "Jazz Night", category: "Jazz" },
  { url: "https://example.com/music/lofi-chill.mp3", name: "Lofi Chill", category: "Lofi" },
  { url: "https://example.com/music/acoustic-breeze.mp3", name: "Acoustic Breeze", category: "Acoustic" },
];

export function MusicSelector({ availableMusic }: MusicSelectorProps) {
  const { customization, updateCustomization } = useBuilder();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use availableMusic from template if provided, otherwise use defaults
  const allTracks = availableMusic.length > 0
    ? availableMusic.map((url, idx) => ({
      url,
      name: `Music Track ${idx + 1}`,
      category: "General"
    }))
    : DEFAULT_MUSIC;

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set(allTracks.map(t => t.category));
    return Array.from(cats);
  }, [allTracks]);

  // Filter tracks based on search and category
  const filteredTracks = useMemo(() => {
    return allTracks.filter(track => {
      const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? track.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [allTracks, searchQuery, selectedCategory]);

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

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search music..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="all"
          value={selectedCategory || "all"}
          onValueChange={(val) => setSelectedCategory(val === "all" ? null : val)}
          className="w-full"
        >
          <TabsList className="w-full h-auto flex-wrap bg-background border p-1">
            <TabsTrigger value="all" className="flex-1 min-w-[60px]">All</TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="flex-1 min-w-[80px]">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Music tracks list with scroll area */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, idx) => (
            <button
              key={idx}
              onClick={() => handleMusicSelect(track.url)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${customization.musicUrl === track.url
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
                }`}
            >
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{track.name}</p>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{track.category}</Badge>
                </div>
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
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No music found</p>
          </div>
        )}
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
