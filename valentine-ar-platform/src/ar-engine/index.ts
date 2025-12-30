/**
 * AR Engine public exports
 */

// Types
export * from "./types";

// Camera
export * from "./utils/camera";

// Gesture
export { GestureDetector } from "./gesture/gesture-detector";
export * from "./gesture/gesture-config";
export * from "./gesture/gesture-events";

// Voice
export { VoiceListener } from "./voice/voice-listener";
export * from "./voice/voice-config";
export * from "./voice/voice-commands";

// Effects
export { EffectManager } from "./effects/effect-manager";
export type { ActiveEffect } from "./effects/effect-manager";

// Performance & Quality
export { PerformanceMonitor, isMobileDevice, getDeviceQualityPreset } from "./utils/performance";
export { AdaptiveQuality, getRecommendedQuality } from "./utils/adaptive-quality";
