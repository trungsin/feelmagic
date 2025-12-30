import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface TemplateCardProps {
  template: {
    id: string
    title: string
    description: string
    previewImage: string
    price: number
  }
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200">
      <Link href={`/templates/${template.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {template.previewImage ? (
            <Image
              src={template.previewImage}
              alt={template.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-valentine-100 to-pink-100">
              <Heart className="h-16 w-16 text-valentine-300" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
            <span className="text-sm font-semibold text-valentine-600">
              ${Number(template.price).toFixed(2)}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/templates/${template.id}`}>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-valentine-500 transition-colors line-clamp-1">
            {template.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {template.description}
        </p>
        <Button asChild className="w-full bg-valentine-500 hover:bg-valentine-600">
          <Link href={`/templates/${template.id}`}>
            View Details
          </Link>
        </Button>
      </div>
    </Card>
  )
}
