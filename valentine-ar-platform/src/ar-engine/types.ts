/**
 * Shared types for AR Engine
 */

export type GestureType =
  | "ILoveYou"
  | "Victory"
  | "Open_Palm"
  | "Thumb_Up"
  | "Thumb_Down"
  | "Closed_Fist"
  | "Pointing_Up";

export type EffectType = "hearts" | "fireworks" | "glow" | "confetti";

export interface GestureTrigger {
  gesture: GestureType;
  effect: EffectType;
  intensity?: number;
}

export interface VoiceTrigger {
  phrase: string;
  effect: EffectType;
  intensity?: number;
}

export interface AREffect {
  type: EffectType;
  intensity?: number;
  color?: string;
  duration?: number;
}

export interface GestureDetectionResult {
  gesture: GestureType;
  confidence: number;
  timestamp: number;
}

export interface VoiceDetectionResult {
  phrase: string;
  confidence: number;
  timestamp: number;
}

export interface PerformanceMetrics {
  fps: number;
  quality: "high" | "medium" | "low";
  particleCount: number;
}

export interface CameraError {
  type: "permission_denied" | "not_found" | "not_readable" | "overconstrained" | "unknown";
  message: string;
}

export interface EffectConfig {
  particleCount?: number;
  color?: string;
  intensity?: number;
  duration?: number;
}
