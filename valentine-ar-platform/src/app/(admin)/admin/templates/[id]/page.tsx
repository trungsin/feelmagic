/**
 * Edit Template Page
 * /admin/templates/[id]
 */

import { requireAdmin } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import { TemplateForm } from "@/components/admin/template-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditTemplatePage({ params }: PageProps) {
  // Protect route
  await requireAdmin()

  const { id } = await params

  // Fetch template
  const template = await prisma.template.findUnique({
    where: { id },
  })

  if (!template) {
    notFound()
  }

  // Convert Decimal to number for form
  const initialData = {
    id: template.id,
    title: template.title,
    description: template.description,
    price: Number(template.price),
    previewImage: template.previewImage,
    previewVideo: template.previewVideo || "",
    polarProductId: template.polarProductId || "",
    availableEffects: template.availableEffects,
    availableMusic: template.availableMusic,
    isActive: template.isActive,
    sortOrder: template.sortOrder,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/templates"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Templates
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Chỉnh sửa Template
        </h1>
        <p className="text-gray-500">Cập nhật thông tin template</p>
      </div>

      {/* Form */}
      <TemplateForm mode="edit" initialData={initialData} />
    </div>
  )
}
