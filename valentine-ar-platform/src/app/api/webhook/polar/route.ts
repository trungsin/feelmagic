import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateUniqueSlug } from "@/lib/slug"
import { env } from "@/lib/env"
import { polarOrderEventSchema } from "@/lib/validations/checkout"
import crypto from "crypto"

/**
 * Verify Polar webhook signature using HMAC SHA256
 * This prevents unauthorized webhook calls
 */
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(body)
    const expectedSignature = hmac.digest('hex')

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await req.text()
    const signature = req.headers.get("webhook-signature") ||
                      req.headers.get("polar-signature")

    // CRITICAL: Verify webhook signature
    if (!signature) {
      console.error("Webhook signature missing")
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 401 }
      )
    }

    // Check if webhook secret is configured
    if (!env.POLAR_WEBHOOK_SECRET) {
      console.error("POLAR_WEBHOOK_SECRET not configured")
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      )
    }

    const isValid = verifyWebhookSignature(body, signature, env.POLAR_WEBHOOK_SECRET)

    if (!isValid) {
      console.error("Invalid webhook signature")
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      )
    }

    // Parse the webhook payload
    const event = JSON.parse(body)

    // Handle different event types
    switch (event.type) {
      case "checkout.created":
        console.log("Checkout created:", event.data.id)
        break

      case "order.created":
        await handleOrderCreated(event.data)
        break

      case "subscription.created":
        // Handle subscription if needed
        break

      default:
        console.log("Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function handleOrderCreated(orderData: any) {
  try {
    console.log("Processing order:", orderData.id)

    // Validate webhook payload with Zod
    const validatedData = polarOrderEventSchema.parse(orderData)
    const { metadata } = validatedData
    const templateId = metadata.templateId
    const userId = metadata.userId || null

    // CRITICAL: Idempotency check - prevent duplicate order processing
    const existingOrder = await prisma.order.findUnique({
      where: { polarOrderId: validatedData.id }
    })

    if (existingOrder) {
      console.log("Order already processed (idempotent):", validatedData.id)
      return
    }

    // Find template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      console.error("Template not found:", templateId)
      throw new Error(`Template ${templateId} not found`)
    }

    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          polarOrderId: validatedData.id,
          polarCheckoutId: validatedData.checkout_id || null,
          templateId: template.id,
          userId: userId,
          status: "PAID",
          amount: Number(validatedData.amount) / 100, // Convert from cents
          currency: validatedData.currency,
          customerEmail: validatedData.customer_email || null,
          customerName: validatedData.customer_name || "Anonymous",
          paidAt: new Date(),
          metadata: metadata as any,
        },
      })

      // Get default config
      const defaultConfig = template.defaultConfig as any

      // Create card with default values
      await tx.card.create({
        data: {
          slug: generateUniqueSlug(),
          orderId: order.id,
          templateId: template.id,
          userId: userId,
          recipientName: "My Love",
          senderName: orderData.customer_name || "Your Valentine",
          message: "Wishing you the most magical Valentine's Day!",
          backgroundType: "IMAGE",
          backgroundUrl: defaultConfig?.backgroundUrl || null,
          musicUrl: defaultConfig?.musicUrl || null,
          arEffects: defaultConfig?.defaultEffects || [],
          voiceTriggers: [
            { phrase: "i love you", effect: "hearts" },
            { phrase: "happy valentine", effect: "fireworks" },
          ],
          gestureTriggers: [
            { gesture: "ILoveYou", effect: "hearts" },
            { gesture: "Victory", effect: "confetti" },
          ],
          isPublished: false,
        },
      })
    })

    console.log("Order processed successfully:", orderData.id)
  } catch (error) {
    console.error("Error handling order:", error)
    throw error
  }
}
