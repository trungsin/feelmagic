/**
 * Orders Table Component
 * Display orders with filtering and pagination
 */

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Order = {
  id: string
  polarOrderId: string
  status: string
  amount: number
  currency: string
  customerEmail: string | null
  customerName: string | null
  createdAt: string
  paidAt: string | null
  user: {
    name: string | null
    email: string
  } | null
  template: {
    title: string
    previewImage: string
  }
}

type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("all")
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  })
  const { toast } = useToast()

  // Fetch orders
  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pagination.page])

  async function fetchOrders() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        status,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      const res = await fetch(`/api/admin/orders?${params}`)
      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  function handlePageChange(newPage: number) {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, { label: string; className: string }> = {
      PENDING: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800",
      },
      PAID: { label: "Paid", className: "bg-green-100 text-green-800" },
      FAILED: { label: "Failed", className: "bg-red-100 text-red-800" },
      REFUNDED: { label: "Refunded", className: "bg-gray-100 text-gray-800" },
    }

    const badge = badges[status] || badges.PENDING
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    )
  }

  if (loading && orders.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">Đang tải...</div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Trạng thái:</label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-gray-600">
            Tổng: {pagination.total} đơn hàng
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Order ID</th>
                <th className="p-4 text-left text-sm font-medium">Customer</th>
                <th className="p-4 text-left text-sm font-medium">Template</th>
                <th className="p-4 text-left text-sm font-medium">Amount</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="text-sm font-mono">
                        {order.polarOrderId.slice(0, 12)}...
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          {order.user?.name ||
                            order.customerName ||
                            "Guest"}
                        </div>
                        <div className="text-gray-500">
                          {order.user?.email || order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">
                        {order.template.title}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">
                        ${Number(order.amount).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {pagination.page} / {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
