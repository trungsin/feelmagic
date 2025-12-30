/**
 * Gesture detection configuration
 */

export const GESTURE_CONFIG = {
  /** Detection confidence threshold (0-1) */
  confidenceThreshold: 0.7,

  /** How long gesture must be held before triggering (ms) */
  holdDuration: 500,

  /** Cooldown between same gesture triggers (ms) */
  cooldown: 1000,

  /** Number of hands to detect */
  numHands: 2,

  /** Running mode for detection */
  runningMode: "VIDEO" as const,

  /** GPU delegate for better performance */
  delegate: "GPU" as const,

  /** MediaPipe model CDN URL */
  modelUrl:
    "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",

  /** MediaPipe WASM files CDN URL */
  wasmUrl: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
} as const;
