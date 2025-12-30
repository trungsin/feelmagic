/**
 * Voice recognition configuration
 */

export const VOICE_CONFIG = {
  /** Recognition language */
  language: "en-US",

  /** Confidence threshold for accepting results (0-1) */
  confidenceThreshold: 0.6,

  /** Continuous listening mode */
  continuous: true,

  /** Show interim results */
  interimResults: false,

  /** Maximum alternatives to return */
  maxAlternatives: 3,

  /** Cooldown between same command triggers (ms) */
  cooldown: 1000,

  /** Levenshtein distance threshold for fuzzy matching */
  fuzzyMatchThreshold: 3,
} as const;
