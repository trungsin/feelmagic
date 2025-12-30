import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { CardItem } from "@/components/dashboard/card-item"
import { Heart, Plus } from "lucide-react"

export const metadata = {
  title: "My Cards | Valentine AR",
  description: "Manage your AR Valentine cards",
}

export const dynamic = "force-dynamic"

async function getUserCards(userId: string) {
  return prisma.card.findMany({
    where: { userId },
    include: {
      template: {
        select: {
          title: true,
          previewImage: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function DashboardPage() {
  const session = await auth()

  // Redirect to signin if not authenticated
  if (!session?.user?.id) {
    redirect('/signin?callbackUrl=/dashboard')
  }

  const cards = await getUserCards(session.user.id)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Cards</h1>
            <p className="text-gray-600">
              Manage and customize your AR Valentine cards
            </p>
          </div>
          <Button asChild className="bg-valentine-500 hover:bg-valentine-600">
            <Link href="/templates">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Link>
          </Button>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-valentine-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-valentine-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No cards yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start creating your first magical AR Valentine card by choosing a template
            </p>
            <Button asChild size="lg" className="bg-valentine-500 hover:bg-valentine-600">
              <Link href="/templates">
                Browse Templates
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
