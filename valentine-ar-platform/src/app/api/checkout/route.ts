import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import { checkoutSchema } from "@/lib/validations/checkout"

/**
 * Checkout API route
 *
 * NOTE: This implementation uses a simplified flow as the @polar-sh/nextjs package
 * exports helper functions (Checkout, Webhooks) rather than a full SDK client.
 *
 * For production, you should:
 * 1. Use @polar-sh/sdk directly for more control
 * 2. Or implement the Checkout helper from @polar-sh/nextjs as a route handler
 * 3. Configure Polar products with proper metadata
 *
 * Current implementation redirects to success page with template info
 * for demonstration purposes until Polar account is fully configured.
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

    // TODO: Integrate real Polar checkout
    // Option 1: Use @polar-sh/sdk for direct API calls
    // import { Polar } from "@polar-sh/sdk"
    // const polar = new Polar({ accessToken: env.POLAR_ACCESS_TOKEN })
    // const checkout = await polar.checkouts.create({ productId: template.polarProductId, ... })
    //
    // Option 2: Use Checkout helper from @polar-sh/nextjs
    // See: https://github.com/polarsource/polar/tree/main/clients/packages/nextjs
    //
    // For now, redirect to placeholder success page
    // This allows the rest of the app to function while Polar is being configured
    const successUrl = `${env.NEXT_PUBLIC_URL}/checkout/success?session_id=demo_${template.id}`

    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error("Checkout error:", error)

    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
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
