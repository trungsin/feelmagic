"use client";

import { useState, useRef } from "react";
import { useBuilder } from "./builder-provider";
import { BackgroundType } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Upload, X, Check, Loader2 } from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload with progress
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate async upload delay
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, we would upload to storage here
      // For now, create a local object URL
      const url = URL.createObjectURL(file);

      clearInterval(interval);
      setUploadProgress(100);

      handleImageSelect(url);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
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
          <div className="space-y-3">
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading... {uploadProgress}%
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Upload your own image</span>
                </div>
              )}
            </div>

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
                  {customization.backgroundUrl === url && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Select an image or upload your own
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
                {customization.backgroundUrl === url && (
                  <div className="absolute top-2 right-2 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                )}
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
