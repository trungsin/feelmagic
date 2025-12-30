/**
 * Voice recognition using Web Speech API
 */

import { VOICE_CONFIG } from "./voice-config";
import { findBestMatch } from "./voice-commands";
import type { VoiceTrigger, VoiceDetectionResult } from "../types";

export type VoiceCallback = (result: VoiceDetectionResult) => void;

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export class VoiceListener {
  private recognition: SpeechRecognition | null = null;
  private callback: VoiceCallback | null = null;
  private commands: VoiceTrigger[] = [];
  private running = false;
  private lastCommandTime = new Map<string, number>();

  /**
   * Check if Web Speech API is supported
   */
  static isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Initialize voice listener
   */
  initialize(commands: VoiceTrigger[]): void {
    if (!VoiceListener.isSupported()) {
      throw new Error("Web Speech API not supported");
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = VOICE_CONFIG.continuous;
    this.recognition.interimResults = VOICE_CONFIG.interimResults;
    this.recognition.lang = VOICE_CONFIG.language;
    this.recognition.maxAlternatives = VOICE_CONFIG.maxAlternatives;

    this.commands = commands;
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.handleResult(event);
    };

    this.recognition.onerror = (event: Event) => {
      console.error("Speech recognition error:", event);
    };

    this.recognition.onend = () => {
      // Auto-restart if still running
      if (this.running && this.recognition) {
        try {
          this.recognition.start();
        } catch (error) {
          console.error("Failed to restart speech recognition:", error);
        }
      }
    };
  }

  /**
   * Start listening
   */
  start(callback: VoiceCallback): void {
    if (!this.recognition) {
      throw new Error("Voice listener not initialized");
    }

    if (this.running) {
      this.stop();
    }

    this.callback = callback;
    this.running = true;
    this.lastCommandTime.clear();

    try {
      this.recognition.start();
    } catch (error) {
      throw new Error(
        `Failed to start voice recognition: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    this.running = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error("Failed to stop speech recognition:", error);
      }
    }
    this.callback = null;
    this.lastCommandTime.clear();
  }

  /**
   * Handle recognition result
   */
  private handleResult(event: SpeechRecognitionEvent): void {
    if (!this.callback) return;

    const results = event.results;
    const lastResult = results[results.length - 1];

    if (!lastResult || !lastResult.isFinal) return;

    const transcript = lastResult[0].transcript.trim();
    const confidence = lastResult[0].confidence;

    if (confidence < VOICE_CONFIG.confidenceThreshold) return;

    // Find matching command using fuzzy matching
    const matchedCommand = findBestMatch(
      transcript,
      this.commands,
      VOICE_CONFIG.fuzzyMatchThreshold
    );

    if (!matchedCommand) return;

    // Check cooldown
    const now = Date.now();
    const lastTrigger = this.lastCommandTime.get(matchedCommand.phrase) || 0;
    const timeSinceLastTrigger = now - lastTrigger;

    if (timeSinceLastTrigger < VOICE_CONFIG.cooldown) {
      return;
    }

    // Trigger callback
    this.lastCommandTime.set(matchedCommand.phrase, now);

    this.callback({
      phrase: matchedCommand.phrase,
      confidence,
      timestamp: now,
    });
  }

  /**
   * Update commands
   */
  updateCommands(commands: VoiceTrigger[]): void {
    this.commands = commands;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    this.recognition = null;
  }

  /**
   * Check if listener is initialized
   */
  isInitialized(): boolean {
    return this.recognition !== null;
  }

  /**
   * Check if listener is running
   */
  isRunning(): boolean {
    return this.running;
  }
}
