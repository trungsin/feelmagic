/**
 * Templates List Page
 * /admin/templates
 */

import { requireAdmin } from "@/lib/auth-middleware"
import { TemplatesTable } from "@/components/admin/templates-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function TemplatesPage() {
  // Protect route - only admins
  await requireAdmin()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-gray-500">
            Quản lý các template AR Valentine
          </p>
        </div>
        <Link href="/admin/templates/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Template
          </Button>
        </Link>
      </div>

      {/* Templates Table */}
      <TemplatesTable />
    </div>
  )
}
