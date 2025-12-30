"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface BuyButtonProps {
  templateId: string
  price: number
}

export function BuyButton({ templateId, price }: BuyButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    setLoading(true)
    // Redirect to checkout API route which will create Polar checkout
    router.push(`/api/checkout?templateId=${templateId}`)
  }

  return (
    <Button
      onClick={handleBuy}
      disabled={loading}
      size="lg"
      className="w-full bg-valentine-500 hover:bg-valentine-600"
    >
      {loading ? (
        "Redirecting to checkout..."
      ) : (
        <>Buy Now - ${price.toFixed(2)}</>
      )}
    </Button>
  )
}
