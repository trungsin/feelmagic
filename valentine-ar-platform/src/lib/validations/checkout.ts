import { z } from "zod"

// Validation schema for checkout query params
export const checkoutSchema = z.object({
  templateId: z.string().cuid("Invalid template ID format"),
})

// Validation schema for Polar webhook order event
export const polarOrderEventSchema = z.object({
  id: z.string(),
  checkout_id: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().length(3, "Currency must be 3 letters"),
  customer_email: z.string().email("Invalid email").optional(),
  customer_name: z.string().optional(),
  metadata: z.object({
    templateId: z.string().cuid("Invalid template ID in metadata"),
    userId: z.string().cuid("Invalid user ID in metadata").nullable().optional(),
  }),
})

// Export TypeScript types
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type PolarOrderEvent = z.infer<typeof polarOrderEventSchema>
