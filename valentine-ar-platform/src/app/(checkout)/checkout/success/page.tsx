import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { CheckCircle, Heart } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

async function getOrderByCheckoutId(checkoutId: string) {
  return prisma.order.findFirst({
    where: {
      polarCheckoutId: checkoutId,
      status: "PAID",
    },
    include: {
      card: true,
      template: true,
    },
  })
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params_data = await searchParams
  const sessionId = params_data.session_id

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Invalid Session</h1>
        <p className="mt-4 text-gray-600">No checkout session found.</p>
        <Button asChild className="mt-8">
          <Link href="/templates">Browse Templates</Link>
        </Button>
      </div>
    )
  }

  // Try to find the order (webhook might still be processing)
  const order = await getOrderByCheckoutId(sessionId)

  if (!order?.card) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <div className="w-20 h-20 bg-valentine-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-valentine-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Processing Your Order...
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please wait a moment while we set up your card. This page will automatically refresh.
          </p>
          <p className="text-sm text-gray-500">
            If this takes longer than a minute, please contact support.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-3xl">
      <div className="bg-white rounded-2xl shadow-xl p-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-valentine-500 to-pink-500 bg-clip-text text-transparent">
          Thank You for Your Purchase!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Your payment was successful. You can now customize your AR Valentine card.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Template</span>
            <span className="font-semibold">{order.template.title}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Amount Paid</span>
            <span className="font-semibold">${Number(order.amount).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order ID</span>
            <span className="font-mono text-sm text-gray-500">{order.id.slice(0, 12)}...</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full bg-valentine-500 hover:bg-valentine-600">
            <Link href={`/builder/${order.card.id}`}>
              Customize Your Card
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          A confirmation email has been sent to {order.customerEmail}
        </p>
      </div>
    </div>
  )
}
