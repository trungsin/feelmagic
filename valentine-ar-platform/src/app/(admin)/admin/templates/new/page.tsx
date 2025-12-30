/**
 * Create Template Page
 * /admin/templates/new
 */

import { requireAdmin } from "@/lib/auth-middleware"
import { TemplateForm } from "@/components/admin/template-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function CreateTemplatePage() {
  // Protect route
  await requireAdmin()

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
        <h1 className="text-3xl font-bold tracking-tight">Tạo Template Mới</h1>
        <p className="text-gray-500">
          Tạo template AR Valentine mới cho người dùng
        </p>
      </div>

      {/* Form */}
      <TemplateForm mode="create" />
    </div>
  )
}
