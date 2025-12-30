/**
 * Voice command types and mappings
 */

import type { EffectType, VoiceTrigger } from "../types";

/**
 * Default voice commands
 */
export const DEFAULT_VOICE_COMMANDS: VoiceTrigger[] = [
  { phrase: "I love you", effect: "hearts", intensity: 0.9 },
  { phrase: "Love you", effect: "hearts", intensity: 0.8 },
  { phrase: "Happy Valentine", effect: "fireworks", intensity: 0.9 },
  { phrase: "Be my valentine", effect: "hearts", intensity: 0.8 },
  { phrase: "Beautiful", effect: "glow", intensity: 0.7 },
  { phrase: "Amazing", effect: "confetti", intensity: 0.7 },
  { phrase: "Wonderful", effect: "glow", intensity: 0.6 },
  { phrase: "Perfect", effect: "confetti", intensity: 0.6 },
];

/**
 * Get effect for voice command
 */
export function getEffectForVoiceCommand(
  phrase: string,
  customCommands?: VoiceTrigger[]
): EffectType | null {
  const commands = customCommands || DEFAULT_VOICE_COMMANDS;
  const normalizedPhrase = phrase.toLowerCase().trim();

  const command = commands.find(
    (cmd) => cmd.phrase.toLowerCase() === normalizedPhrase
  );

  return command?.effect || null;
}

/**
 * Get intensity for voice command
 */
export function getIntensityForVoiceCommand(
  phrase: string,
  customCommands?: VoiceTrigger[]
): number {
  const commands = customCommands || DEFAULT_VOICE_COMMANDS;
  const normalizedPhrase = phrase.toLowerCase().trim();

  const command = commands.find(
    (cmd) => cmd.phrase.toLowerCase() === normalizedPhrase
  );

  return command?.intensity || 0.5;
}

/**
 * Validate voice trigger
 */
export function isValidVoiceTrigger(trigger: unknown): trigger is VoiceTrigger {
  if (!trigger || typeof trigger !== "object") return false;

  const t = trigger as VoiceTrigger;

  const validEffects: EffectType[] = ["hearts", "fireworks", "glow", "confetti"];

  return (
    typeof t.phrase === "string" &&
    t.phrase.length > 0 &&
    validEffects.includes(t.effect) &&
    (t.intensity === undefined ||
      (typeof t.intensity === "number" && t.intensity >= 0 && t.intensity <= 1))
  );
}

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Find best matching command using fuzzy matching
 */
export function findBestMatch(
  input: string,
  commands: VoiceTrigger[],
  threshold: number
): VoiceTrigger | null {
  const normalizedInput = input.toLowerCase().trim();
  let bestMatch: VoiceTrigger | null = null;
  let bestDistance = Infinity;

  for (const command of commands) {
    const normalizedPhrase = command.phrase.toLowerCase().trim();

    // Exact match
    if (normalizedPhrase === normalizedInput) {
      return command;
    }

    // Fuzzy match
    const distance = levenshteinDistance(normalizedInput, normalizedPhrase);
    if (distance < bestDistance && distance <= threshold) {
      bestDistance = distance;
      bestMatch = command;
    }
  }

  return bestMatch;
}
