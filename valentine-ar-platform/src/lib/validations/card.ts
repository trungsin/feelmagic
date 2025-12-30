import { z } from "zod";
import { BackgroundType } from "@prisma/client";

// AR Effect schema
export const arEffectSchema = z.object({
  type: z.enum(["hearts", "fireworks", "glow", "confetti"]),
  intensity: z.number().min(0).max(1).default(0.8),
  color: z.string().optional(), // For effects that support color (hearts, glow)
  enabled: z.boolean().default(true),
});

// Voice trigger schema
export const voiceTriggerSchema = z.object({
  phrase: z.string().min(1).max(50),
  effect: z.enum(["hearts", "fireworks", "glow", "confetti"]),
});

// Gesture trigger schema
export const gestureTriggerSchema = z.object({
  gesture: z.enum(["ILoveYou", "Victory", "ThumbsUp", "OpenPalm"]),
  effect: z.enum(["hearts", "fireworks", "glow", "confetti"]),
});

// Card customization schema
export const cardCustomizationSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required").max(50, "Max 50 characters"),
  senderName: z.string().min(1, "Sender name is required").max(50, "Max 50 characters"),
  message: z.string().min(1, "Message is required").max(500, "Max 500 characters"),
  backgroundType: z.nativeEnum(BackgroundType),
  backgroundColor: z.string().nullable().optional(),
  backgroundUrl: z.string().nullable().optional(),
  musicUrl: z.string().nullable().optional(),
  musicVolume: z.number().min(0).max(1).default(0.5),
  arEffects: z.array(arEffectSchema).default([]),
  voiceTriggers: z.array(voiceTriggerSchema).max(5, "Maximum 5 voice triggers").default([]),
  gestureTriggers: z.array(gestureTriggerSchema).max(5, "Maximum 5 gesture triggers").default([]),
});

// Publish card schema
export const publishCardSchema = z.object({
  isPublished: z.boolean(),
  expiresAt: z.date().nullable().optional(),
});

// Type exports
export type AREffect = z.infer<typeof arEffectSchema>;
export type VoiceTrigger = z.infer<typeof voiceTriggerSchema>;
export type GestureTrigger = z.infer<typeof gestureTriggerSchema>;
export type CardCustomization = z.infer<typeof cardCustomizationSchema>;
export type PublishCard = z.infer<typeof publishCardSchema>;

// Effect types constant
export const EFFECT_TYPES = ["hearts", "fireworks", "glow", "confetti"] as const;

// Gesture types constant
export const GESTURE_TYPES = ["ILoveYou", "Victory", "ThumbsUp", "OpenPalm"] as const;

// Gesture labels for UI
export const GESTURE_LABELS: Record<typeof GESTURE_TYPES[number], string> = {
  ILoveYou: "I Love You (🤟)",
  Victory: "Victory Sign (✌️)",
  ThumbsUp: "Thumbs Up (👍)",
  OpenPalm: "Open Palm / Wave (✋)",
};
