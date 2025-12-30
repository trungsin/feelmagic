import { prisma } from "@/lib/prisma"
import { TemplateGrid } from "@/components/marketplace/template-grid"

export const metadata = {
  title: "AR Valentine Templates | Valentine AR",
  description: "Browse our collection of interactive AR Valentine card templates",
}

export const dynamic = "force-dynamic"

async function getActiveTemplates() {
  return prisma.template.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      description: true,
      previewImage: true,
      price: true,
    },
    orderBy: { sortOrder: "asc" },
  })
}

export default async function TemplatesPage() {
  const templates = await getActiveTemplates()

  // Convert Decimal to number for client components
  const templatesWithNumbers = templates.map((t) => ({
    ...t,
    price: Number(t.price),
  }))

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-valentine-500 to-pink-500 bg-clip-text text-transparent">
            Valentine AR Templates
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our collection of beautiful AR Valentine cards and
            personalize them with your own message
          </p>
        </div>

        <TemplateGrid templates={templatesWithNumbers} />
      </div>
    </div>
  )
}
