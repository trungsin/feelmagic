import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Edit, ExternalLink, Eye } from "lucide-react"

interface CardItemProps {
  card: {
    id: string
    slug: string
    recipientName: string
    senderName: string
    isPublished: boolean
    viewCount: number
    createdAt: Date
    template: {
      title: string
      previewImage: string
    }
  }
}

export function CardItem({ card }: CardItemProps) {
  const publicUrl = `${process.env.NEXT_PUBLIC_URL}/card/${card.slug}`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Preview */}
        <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square bg-gray-100 flex-shrink-0">
          {card.template.previewImage ? (
            <Image
              src={card.template.previewImage}
              alt={card.template.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-valentine-100 to-pink-100">
              <Heart className="h-12 w-12 text-valentine-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                To: {card.recipientName}
              </h3>
              <p className="text-sm text-gray-600">
                From: {card.senderName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {card.template.title}
              </p>
            </div>
            <Badge variant={card.isPublished ? "default" : "secondary"}>
              {card.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{card.viewCount} views</span>
            </div>
            <div>
              Created {new Date(card.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1 sm:flex-none">
              <Link href={`/builder/${card.id}`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>

            {card.isPublished && (
              <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Link href={`/card/${card.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
