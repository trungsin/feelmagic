/**
 * Adaptive quality settings based on performance
 */

import type { PerformanceMetrics, EffectConfig } from "../types";

export interface QualitySettings {
  particleCount: number;
  gestureDetectionInterval: number;
  enableShadows: boolean;
  enableBloom: boolean;
  antialias: boolean;
}

export class AdaptiveQuality {
  private currentQuality: "high" | "medium" | "low" = "high";
  private settings: QualitySettings;

  constructor(initialQuality: "high" | "medium" | "low" = "high") {
    this.currentQuality = initialQuality;
    this.settings = this.getSettingsForQuality(initialQuality);
  }

  /**
   * Update quality based on performance metrics
   */
  updateFromMetrics(metrics: PerformanceMetrics): boolean {
    const newQuality = metrics.quality;

    if (newQuality !== this.currentQuality) {
      this.currentQuality = newQuality;
      this.settings = this.getSettingsForQuality(newQuality);
      return true; // Quality changed
    }

    return false; // No change
  }

  /**
   * Get settings for quality level
   */
  private getSettingsForQuality(
    quality: "high" | "medium" | "low"
  ): QualitySettings {
    switch (quality) {
      case "high":
        return {
          particleCount: 100,
          gestureDetectionInterval: 16, // 60 FPS
          enableShadows: true,
          enableBloom: true,
          antialias: true,
        };

      case "medium":
        return {
          particleCount: 50,
          gestureDetectionInterval: 33, // 30 FPS
          enableShadows: false,
          enableBloom: false,
          antialias: true,
        };

      case "low":
        return {
          particleCount: 25,
          gestureDetectionInterval: 66, // 15 FPS
          enableShadows: false,
          enableBloom: false,
          antialias: false,
        };

      default:
        return this.getSettingsForQuality("medium");
    }
  }

  /**
   * Get current settings
   */
  getSettings(): QualitySettings {
    return { ...this.settings };
  }

  /**
   * Get current quality level
   */
  getQuality(): "high" | "medium" | "low" {
    return this.currentQuality;
  }

  /**
   * Adjust effect config based on quality
   */
  adjustEffectConfig(config: EffectConfig): EffectConfig {
    return {
      ...config,
      particleCount: Math.min(
        config.particleCount || this.settings.particleCount,
        this.settings.particleCount
      ),
    };
  }

  /**
   * Manually set quality level
   */
  setQuality(quality: "high" | "medium" | "low"): void {
    if (quality !== this.currentQuality) {
      this.currentQuality = quality;
      this.settings = this.getSettingsForQuality(quality);
    }
  }
}

/**
 * Get recommended quality for device
 */
export function getRecommendedQuality(): "high" | "medium" | "low" {
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  if (isMobile) {
    return "medium";
  }

  // Check memory (if available) - non-standard Chrome feature
  const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (memory) {
    const usedMemoryMB = memory.usedJSHeapSize / 1048576;
    const totalMemoryMB = memory.jsHeapSizeLimit / 1048576;
    const memoryUsage = usedMemoryMB / totalMemoryMB;

    if (memoryUsage > 0.8) {
      return "low";
    }
  }

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  if (cores <= 2) {
    return "medium";
  }

  return "high";
}
