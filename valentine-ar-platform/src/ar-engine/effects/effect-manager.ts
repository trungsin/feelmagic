/**
 * Effect manager for orchestrating visual effects
 */

import type { EffectType, AREffect, EffectConfig } from "../types";

export interface ActiveEffect {
  id: string;
  type: EffectType;
  config: EffectConfig;
  startTime: number;
  duration: number;
}

export type EffectCallback = (effects: ActiveEffect[]) => void;

export class EffectManager {
  private effects = new Map<string, ActiveEffect>();
  private callback: EffectCallback | null = null;
  private animationFrameId: number | null = null;
  private running = false;

  /**
   * Start effect manager
   */
  start(callback: EffectCallback): void {
    this.callback = callback;
    this.running = true;
    this.updateLoop();
  }

  /**
   * Stop effect manager
   */
  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.callback = null;
    this.effects.clear();
  }

  /**
   * Trigger an effect
   */
  triggerEffect(effect: AREffect): string {
    const id = `${effect.type}-${Date.now()}-${Math.random()}`;
    const duration = effect.duration || this.getDefaultDuration(effect.type);

    const activeEffect: ActiveEffect = {
      id,
      type: effect.type,
      config: {
        intensity: effect.intensity || 0.5,
        color: effect.color,
        particleCount: this.getParticleCount(effect.intensity || 0.5),
        duration,
      },
      startTime: Date.now(),
      duration,
    };

    this.effects.set(id, activeEffect);
    this.notifyCallback();

    return id;
  }

  /**
   * Cancel an effect
   */
  cancelEffect(id: string): void {
    if (this.effects.delete(id)) {
      this.notifyCallback();
    }
  }

  /**
   * Cancel all effects of a type
   */
  cancelEffectsByType(type: EffectType): void {
    let changed = false;
    for (const [id, effect] of this.effects) {
      if (effect.type === type) {
        this.effects.delete(id);
        changed = true;
      }
    }
    if (changed) {
      this.notifyCallback();
    }
  }

  /**
   * Cancel all effects
   */
  cancelAllEffects(): void {
    if (this.effects.size > 0) {
      this.effects.clear();
      this.notifyCallback();
    }
  }

  /**
   * Get active effects
   */
  getActiveEffects(): ActiveEffect[] {
    return Array.from(this.effects.values());
  }

  /**
   * Update loop to clean up expired effects
   */
  private updateLoop = (): void => {
    if (!this.running) return;

    const now = Date.now();
    let changed = false;

    for (const [id, effect] of this.effects) {
      const elapsed = now - effect.startTime;
      if (elapsed >= effect.duration) {
        this.effects.delete(id);
        changed = true;
      }
    }

    if (changed) {
      this.notifyCallback();
    }

    this.animationFrameId = requestAnimationFrame(this.updateLoop);
  };

  /**
   * Notify callback with current effects
   */
  private notifyCallback(): void {
    if (this.callback) {
      this.callback(this.getActiveEffects());
    }
  }

  /**
   * Get default duration for effect type
   */
  private getDefaultDuration(type: EffectType): number {
    switch (type) {
      case "hearts":
        return 3000;
      case "fireworks":
        return 2500;
      case "glow":
        return 2000;
      case "confetti":
        return 3000;
      default:
        return 2500;
    }
  }

  /**
   * Get particle count based on intensity
   */
  private getParticleCount(intensity: number): number {
    return Math.floor(intensity * 100);
  }

  /**
   * Check if manager is running
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
