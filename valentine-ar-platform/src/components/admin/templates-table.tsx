/**
 * Templates Table Component
 * Display and manage templates in admin panel
 */

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Power, PowerOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Template = {
  id: string
  title: string
  description: string
  price: number
  previewImage: string
  isActive: boolean
  sortOrder: number
  _count: {
    orders: number
    cards: number
  }
}

export function TemplatesTable() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch templates
  useEffect(() => {
    fetchTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchTemplates() {
    try {
      const res = await fetch("/api/admin/templates")
      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setTemplates(data.templates)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách templates",
      })
    } finally {
      setLoading(false)
    }
  }

  // Toggle active status
  async function toggleActive(id: string, currentStatus: boolean) {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!res.ok) throw new Error("Failed to toggle")

      toast({
        title: "Thành công",
        description: `Template đã ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"}`,
      })

      fetchTemplates()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thay đổi trạng thái",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Delete template
  async function handleDelete() {
    if (!deleteId) return

    setActionLoading(deleteId)
    try {
      const res = await fetch(`/api/admin/templates/${deleteId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to delete")
      }

      toast({
        title: "Đã xóa",
        description: "Template đã được xóa thành công",
      })

      fetchTemplates()
      setDeleteId(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể xóa template",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">Đang tải...</div>
      </Card>
    )
  }

  if (templates.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <p className="text-gray-500">Chưa có template nào</p>
          <Link href="/admin/templates/new">
            <Button className="mt-4">Tạo template đầu tiên</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Preview</th>
                <th className="p-4 text-left text-sm font-medium">Title</th>
                <th className="p-4 text-left text-sm font-medium">Price</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Orders</th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={template.previewImage}
                        alt={template.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <div className="font-medium">{template.title}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {template.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">
                      ${Number(template.price).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        template.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {template._count.orders} orders
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          toggleActive(template.id, template.isActive)
                        }
                        disabled={actionLoading === template.id}
                      >
                        {template.isActive ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                      <Link href={`/admin/templates/${template.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(template.id)}
                        disabled={actionLoading === template.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa template này? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!!actionLoading}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
