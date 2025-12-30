import { redirect } from "next/navigation"
import { Suspense } from "react"

export const metadata = {
  title: "Checkout | Valentine AR",
  description: "Complete your purchase",
}

interface CheckoutPageProps {
  searchParams: Promise<{
    templateId?: string
  }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  // Await searchParams (Next.js 15 async params)
  const params = await searchParams

  // Validate templateId
  if (!params.templateId) {
    redirect('/templates')
  }

  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutRedirect templateId={params.templateId} />
    </Suspense>
  )
}

/**
 * Redirects to checkout API endpoint
 * This component exists to provide loading state while API processes
 */
function CheckoutRedirect({ templateId }: { templateId: string }): never {
  // Redirect to API route which will handle Polar checkout
  redirect(`/api/checkout?templateId=${templateId}`)
}

/**
 * Loading state shown while preparing checkout
 */
function CheckoutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="text-center space-y-6 p-8">
        {/* Animated loading spinner */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-pink-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Preparing Your Checkout
          </h2>
          <p className="text-gray-600">
            Redirecting to secure payment...
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  )
}
