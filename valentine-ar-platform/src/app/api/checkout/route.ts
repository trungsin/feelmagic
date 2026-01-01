import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import { checkoutSchema } from "@/lib/validations/checkout"
import { Polar } from "@polar-sh/sdk"
import { generateUniqueSlug } from "@/lib/slug"

/**
 * Checkout API route
 * Integrates with Polar SDK to create a real checkout session.
 */
export async function GET(req: NextRequest) {
  try {
    // Validate input
    const searchParams = req.nextUrl.searchParams
    const { templateId } = checkoutSchema.parse({
      templateId: searchParams.get("templateId"),
    })

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: templateId, isActive: true },
    })

    if (!template) {
      return NextResponse.json(
        { error: "Template not found or inactive" },
        { status: 404 }
      )
    }

    // Get current session (optional for guest checkout)
    const session = await auth()

    // Check if template has Polar product configured
    if (!template.polarProductId) {
      console.error(`Template ${template.id} missing polarProductId`)
      return NextResponse.json(
        { error: "Template not configured for checkout. Please contact support." },
        { status: 400 }
      )
    }

    // Demo mode: Create order directly without Polar
    if (!env.POLAR_ACCESS_TOKEN) {
      console.log("Demo mode: Creating order directly")

      // Create order and card in transaction
      const result = await prisma.$transaction(async (tx) => {
        const demoOrderId = `demo_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // Create order
        const order = await tx.order.create({
          data: {
            polarOrderId: demoOrderId,
            polarCheckoutId: demoOrderId, // Same as orderId for demo
            templateId: template.id,
            userId: session?.user?.id || null,
            status: "PAID",
            amount: template.price,
            currency: "USD",
            customerEmail: session?.user?.email || "demo@example.com",
            customerName: session?.user?.name || "Demo User",
            paidAt: new Date(),
            metadata: {
              isDemo: true,
              templateId: template.id,
            },
          },
        })

        // Get default config
        const defaultConfig = template.defaultConfig as Record<string, unknown> || {}

        // Create card
        const card = await tx.card.create({
          data: {
            slug: generateUniqueSlug(),
            orderId: order.id,
            templateId: template.id,
            userId: session?.user?.id || null,
            recipientName: "My Love",
            senderName: session?.user?.name || "Your Valentine",
            message: "Wishing you the most magical Valentine's Day!",
            backgroundType: "IMAGE",
            backgroundUrl: (defaultConfig.backgroundUrl as string) || null,
            musicUrl: null,
            arEffects: (defaultConfig.defaultEffects as string[]) || [],
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

        return { order, card }
      })

      console.log("Demo order created:", result.order.id)

      // Redirect to success with the order ID
      const successUrl = `${env.NEXT_PUBLIC_URL}/checkout/success?session_id=${result.order.polarOrderId}`
      return NextResponse.redirect(successUrl)
    }

    // Initialize Polar SDK
    const polar = new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN,
    })

    // Create Polar checkout session
    const checkout = await polar.checkouts.create({
      products: [template.polarProductId],
      successUrl: `${env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        templateId: template.id,
        userId: session?.user?.id || "",
      },
    })

    if (!checkout.url) {
      throw new Error("Failed to get checkout URL from Polar")
    }

    // Redirect to Polar checkout
    return NextResponse.redirect(checkout.url)
  } catch (error: any) {
    console.error("Checkout error:", error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 }
    )
  }
}
