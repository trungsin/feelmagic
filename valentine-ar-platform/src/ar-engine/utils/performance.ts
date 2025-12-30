/**
 * Performance monitoring utilities
 */

import type { PerformanceMetrics } from "../types";

export type PerformanceCallback = (metrics: PerformanceMetrics) => void;

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private animationFrameId: number | null = null;
  private callback: PerformanceCallback | null = null;
  private running = false;

  // FPS thresholds for quality levels
  private static readonly HIGH_FPS = 50;
  private static readonly MEDIUM_FPS = 30;

  /**
   * Start monitoring
   */
  start(callback: PerformanceCallback): void {
    this.callback = callback;
    this.running = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.monitorLoop();
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.callback = null;
  }

  /**
   * Monitoring loop
   */
  private monitorLoop = (): void => {
    if (!this.running) return;

    const now = performance.now();
    this.frameCount++;

    // Calculate FPS every second
    const elapsed = now - this.lastTime;
    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = now;

      // Notify callback with metrics
      if (this.callback) {
        const metrics = this.getMetrics();
        this.callback(metrics);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.monitorLoop);
  };

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    const quality = this.getQualityLevel();
    const particleCount = this.getParticleCount(quality);

    return {
      fps: this.fps,
      quality,
      particleCount,
    };
  }

  /**
   * Get quality level based on FPS
   */
  private getQualityLevel(): "high" | "medium" | "low" {
    if (this.fps >= PerformanceMonitor.HIGH_FPS) {
      return "high";
    } else if (this.fps >= PerformanceMonitor.MEDIUM_FPS) {
      return "medium";
    } else {
      return "low";
    }
  }

  /**
   * Get particle count based on quality
   */
  private getParticleCount(
    quality: "high" | "medium" | "low"
  ): number {
    switch (quality) {
      case "high":
        return 100;
      case "medium":
        return 50;
      case "low":
        return 25;
      default:
        return 50;
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Check if monitor is running
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
  }
}

/**
 * Detect if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Get device-specific quality preset
 */
export function getDeviceQualityPreset(): "high" | "medium" | "low" {
  if (isMobileDevice()) {
    return "medium";
  }

  // Check GPU tier (basic heuristic)
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!gl) {
    return "low";
  }

  return "high";
}
