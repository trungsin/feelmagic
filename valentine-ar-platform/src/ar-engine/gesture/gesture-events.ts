/**
 * Gesture event types and mappings
 */

import type { GestureType, EffectType, GestureTrigger } from "../types";

/**
 * Default gesture-to-effect mapping
 */
export const DEFAULT_GESTURE_MAPPING: GestureTrigger[] = [
  { gesture: "ILoveYou", effect: "hearts", intensity: 0.8 },
  { gesture: "Victory", effect: "confetti", intensity: 0.7 },
  { gesture: "Open_Palm", effect: "glow", intensity: 0.6 },
  { gesture: "Thumb_Up", effect: "hearts", intensity: 0.5 },
  { gesture: "Thumb_Down", effect: "glow", intensity: 0.4 },
  { gesture: "Closed_Fist", effect: "fireworks", intensity: 0.9 },
  { gesture: "Pointing_Up", effect: "confetti", intensity: 0.6 },
];

/**
 * Get effect for gesture
 */
export function getEffectForGesture(
  gesture: GestureType,
  customMapping?: GestureTrigger[]
): EffectType | null {
  const mapping = customMapping || DEFAULT_GESTURE_MAPPING;
  const trigger = mapping.find((t) => t.gesture === gesture);
  return trigger?.effect || null;
}

/**
 * Get intensity for gesture
 */
export function getIntensityForGesture(
  gesture: GestureType,
  customMapping?: GestureTrigger[]
): number {
  const mapping = customMapping || DEFAULT_GESTURE_MAPPING;
  const trigger = mapping.find((t) => t.gesture === gesture);
  return trigger?.intensity || 0.5;
}

/**
 * Validate gesture trigger
 */
export function isValidGestureTrigger(trigger: unknown): trigger is GestureTrigger {
  if (!trigger || typeof trigger !== "object") return false;

  const t = trigger as GestureTrigger;

  const validGestures: GestureType[] = [
    "ILoveYou",
    "Victory",
    "Open_Palm",
    "Thumb_Up",
    "Thumb_Down",
    "Closed_Fist",
    "Pointing_Up",
  ];

  const validEffects: EffectType[] = ["hearts", "fireworks", "glow", "confetti"];

  return (
    validGestures.includes(t.gesture) &&
    validEffects.includes(t.effect) &&
    (t.intensity === undefined || (typeof t.intensity === "number" && t.intensity >= 0 && t.intensity <= 1))
  );
}

/**
 * Normalize gesture name from MediaPipe
 */
export function normalizeGestureName(name: string): GestureType | null {
  const normalized = name.replace(/_/g, "").toLowerCase();

  const gestureMap: Record<string, GestureType> = {
    iloveyou: "ILoveYou",
    victory: "Victory",
    openpalm: "Open_Palm",
    thumbup: "Thumb_Up",
    thumbdown: "Thumb_Down",
    closedfist: "Closed_Fist",
    pointingup: "Pointing_Up",
  };

  return gestureMap[normalized] || null;
}
