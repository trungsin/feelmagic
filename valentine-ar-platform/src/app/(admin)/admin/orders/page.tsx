/**
 * Orders Management Page
 * /admin/orders
 */

import { requireAdmin } from "@/lib/auth-middleware"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function OrdersPage() {
  // Protect route
  await requireAdmin()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-gray-500">Quản lý đơn hàng và thanh toán</p>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  )
}
