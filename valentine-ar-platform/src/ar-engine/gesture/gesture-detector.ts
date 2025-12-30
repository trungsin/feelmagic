/**
 * Gesture detection using MediaPipe
 */

import {
  GestureRecognizer,
  FilesetResolver,
  type GestureRecognizerResult,
} from "@mediapipe/tasks-vision";
import { GESTURE_CONFIG } from "./gesture-config";
import { normalizeGestureName } from "./gesture-events";
import type { GestureType, GestureDetectionResult } from "../types";

export type GestureCallback = (result: GestureDetectionResult) => void;

export class GestureDetector {
  private recognizer: GestureRecognizer | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private running = false;
  private animationFrameId: number | null = null;
  private lastGestureTime = new Map<GestureType, number>();
  private gestureStartTime = new Map<GestureType, number>();
  private callback: GestureCallback | null = null;

  /**
   * Initialize MediaPipe GestureRecognizer
   */
  async initialize(): Promise<void> {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        GESTURE_CONFIG.wasmUrl
      );

      this.recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: GESTURE_CONFIG.modelUrl,
          delegate: GESTURE_CONFIG.delegate,
        },
        runningMode: GESTURE_CONFIG.runningMode,
        numHands: GESTURE_CONFIG.numHands,
      });
    } catch (error) {
      throw new Error(
        `Failed to initialize gesture recognizer: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Start gesture detection
   */
  start(
    videoElement: HTMLVideoElement,
    callback: GestureCallback
  ): void {
    if (!this.recognizer) {
      throw new Error("Gesture recognizer not initialized");
    }

    if (this.running) {
      this.stop();
    }

    this.videoElement = videoElement;
    this.callback = callback;
    this.running = true;
    this.lastGestureTime.clear();
    this.gestureStartTime.clear();

    this.detectLoop();
  }

  /**
   * Stop gesture detection
   */
  stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.videoElement = null;
    this.callback = null;
    this.lastGestureTime.clear();
    this.gestureStartTime.clear();
  }

  /**
   * Detection loop
   */
  private detectLoop = (): void => {
    if (!this.running || !this.videoElement || !this.recognizer) {
      return;
    }

    try {
      const now = performance.now();
      const result = this.recognizer.recognizeForVideo(
        this.videoElement,
        now
      );

      this.processResult(result, now);
    } catch (error) {
      console.error("Gesture detection error:", error);
    }

    this.animationFrameId = requestAnimationFrame(this.detectLoop);
  };

  /**
   * Process detection result
   */
  private processResult(
    result: GestureRecognizerResult,
    timestamp: number
  ): void {
    // Clear gestures that are no longer detected
    const currentGestures = new Set<GestureType>();

    // Process detected gestures
    if (result.gestures && result.gestures.length > 0) {
      for (const handGestures of result.gestures) {
        if (handGestures.length === 0) continue;

        const topGesture = handGestures[0];
        const confidence = topGesture.score || 0;

        if (confidence < GESTURE_CONFIG.confidenceThreshold) continue;

        const gestureName = normalizeGestureName(
          topGesture.categoryName || ""
        );

        if (!gestureName) continue;

        currentGestures.add(gestureName);

        // Track gesture hold time
        if (!this.gestureStartTime.has(gestureName)) {
          this.gestureStartTime.set(gestureName, timestamp);
        }

        const holdTime = timestamp - (this.gestureStartTime.get(gestureName) || timestamp);

        // Check if gesture held long enough
        if (holdTime < GESTURE_CONFIG.holdDuration) {
          continue;
        }

        // Check cooldown
        const lastTrigger = this.lastGestureTime.get(gestureName) || 0;
        const timeSinceLastTrigger = timestamp - lastTrigger;

        if (timeSinceLastTrigger < GESTURE_CONFIG.cooldown) {
          continue;
        }

        // Trigger callback
        this.lastGestureTime.set(gestureName, timestamp);
        this.gestureStartTime.delete(gestureName);

        if (this.callback) {
          this.callback({
            gesture: gestureName,
            confidence,
            timestamp,
          });
        }
      }
    }

    // Clear start times for gestures no longer detected
    for (const [gesture] of this.gestureStartTime) {
      if (!currentGestures.has(gesture)) {
        this.gestureStartTime.delete(gesture);
      }
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    if (this.recognizer) {
      this.recognizer.close();
      this.recognizer = null;
    }
  }

  /**
   * Check if detector is initialized
   */
  isInitialized(): boolean {
    return this.recognizer !== null;
  }

  /**
   * Check if detector is running
   */
  isRunning(): boolean {
    return this.running;
  }
}
