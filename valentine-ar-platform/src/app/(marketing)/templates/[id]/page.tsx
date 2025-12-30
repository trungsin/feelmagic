import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { BuyButton } from "@/components/marketplace/buy-button"
import { Heart, Sparkles, Music, Palette, ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ id: string }>
}

async function getTemplate(id: string) {
  return prisma.template.findUnique({
    where: { id, isActive: true },
    select: {
      id: true,
      title: true,
      description: true,
      previewImage: true,
      previewVideo: true,
      price: true,
      availableEffects: true,
      availableMusic: true,
      defaultConfig: true,
    },
  })
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const template = await getTemplate(id)

  if (!template) {
    return {
      title: "Template Not Found",
    }
  }

  return {
    title: `${template.title} | Valentine AR`,
    description: template.description,
  }
}

export default async function TemplateDetailPage({ params }: Props) {
  const { id } = await params
  const template = await getTemplate(id)

  if (!template) {
    notFound()
  }

  const price = Number(template.price)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/templates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Preview */}
          <div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
              {template.previewImage ? (
                <Image
                  src={template.previewImage}
                  alt={template.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-valentine-100 to-pink-100">
                  <Heart className="h-24 w-24 text-valentine-300" />
                </div>
              )}
            </div>

            {template.previewVideo && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Video Preview
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <video
                    src={template.previewVideo}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-valentine-500 to-pink-500 bg-clip-text text-transparent">
                {template.title}
              </h1>
              <p className="text-lg text-gray-600">{template.description}</p>
            </div>

            {/* Price */}
            <div className="border-t border-b py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-gray-600">Price</span>
                <span className="text-3xl font-bold text-valentine-500">
                  ${price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">What&apos;s Included</h3>

              {template.availableEffects && template.availableEffects.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-valentine-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-valentine-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">AR Effects</h4>
                    <p className="text-sm text-gray-600">
                      {template.availableEffects.join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {template.availableMusic && template.availableMusic.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music className="h-5 w-5 text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Background Music</h4>
                    <p className="text-sm text-gray-600">
                      {template.availableMusic.length} music options available
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Full Customization</h4>
                  <p className="text-sm text-gray-600">
                    Personalize names, messages, backgrounds, and effects
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6 space-y-4">
              <BuyButton templateId={template.id} price={price} />
              <p className="text-sm text-gray-500 text-center">
                Secure checkout powered by Polar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
