"use client";

import { useState } from "react";
import { useBuilder } from "./builder-provider";
import { BackgroundType } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Sample backgrounds (will be replaced with real data)
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400",
  "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=400",
  "https://images.unsplash.com/photo-1473552912822-de36ce21ed2b?w=400",
];

const SAMPLE_VIDEOS = [
  "https://example.com/bg-video-1.mp4",
  "https://example.com/bg-video-2.mp4",
];

export function BackgroundPicker() {
  const { customization, updateCustomization } = useBuilder();
  const [colorValue, setColorValue] = useState(customization.backgroundColor || "#ff69b4");

  const handleTabChange = (value: string) => {
    const bgType = value.toUpperCase() as BackgroundType;
    updateCustomization({
      backgroundType: bgType,
      backgroundColor: bgType === BackgroundType.COLOR ? colorValue : null,
      backgroundUrl: bgType !== BackgroundType.COLOR ? customization.backgroundUrl : null,
    });
  };

  const handleColorChange = (color: string) => {
    setColorValue(color);
    updateCustomization({
      backgroundType: BackgroundType.COLOR,
      backgroundColor: color,
      backgroundUrl: null,
    });
  };

  const handleImageSelect = (url: string) => {
    updateCustomization({
      backgroundType: BackgroundType.IMAGE,
      backgroundUrl: url,
      backgroundColor: null,
    });
  };

  const handleVideoSelect = (url: string) => {
    updateCustomization({
      backgroundType: BackgroundType.VIDEO,
      backgroundUrl: url,
      backgroundColor: null,
    });
  };

  return (
    <div className="space-y-3">
      <Label>Background</Label>

      <Tabs
        value={customization.backgroundType.toLowerCase()}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={colorValue}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-12 w-20 cursor-pointer"
            />
            <Input
              type="text"
              value={colorValue}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#ff69b4"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Choose a solid color background
          </p>
        </TabsContent>

        <TabsContent value="image" className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {SAMPLE_IMAGES.map((url, idx) => (
              <button
                key={idx}
                onClick={() => handleImageSelect(url)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  customization.backgroundUrl === url
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <img
                  src={url}
                  alt={`Background ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Select an image background
          </p>
        </TabsContent>

        <TabsContent value="video" className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {SAMPLE_VIDEOS.map((url, idx) => (
              <button
                key={idx}
                onClick={() => handleVideoSelect(url)}
                className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                  customization.backgroundUrl === url
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                    🎬
                  </div>
                  <div>
                    <p className="font-medium">Video Background {idx + 1}</p>
                    <p className="text-xs text-muted-foreground">{url}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Select a video background
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
