/**
 * Admin Dashboard Page
 * Overview của admin panel với stats và recent activity
 */

import { StatsCard } from "@/components/admin/stats-card"
import { RecentOrders } from "@/components/admin/recent-orders"
import { DollarSign, ShoppingCart, Palette, Users } from "lucide-react"

async function getDashboardData() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

  try {
    const res = await fetch(`${baseUrl}/api/admin/dashboard`, {
      cache: "no-store",
      headers: {
        Cookie: "", // Will use server-side session
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard data")
    }

    return res.json()
  } catch (error) {
    console.error("Dashboard fetch error:", error)
    // Return empty data on error
    return {
      stats: {
        totalRevenue: 0,
        totalOrders: 0,
        activeTemplates: 0,
        totalUsers: 0,
      },
      recentOrders: [],
    }
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Chào mừng đến với Valentine AR Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng doanh thu"
          value={`$${Number(data.stats.totalRevenue).toFixed(2)}`}
          subtitle="Tất cả orders đã thanh toán"
          icon={DollarSign}
        />
        <StatsCard
          title="Tổng đơn hàng"
          value={data.stats.totalOrders}
          subtitle="Orders đã hoàn thành"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Templates hoạt động"
          value={data.stats.activeTemplates}
          subtitle="Templates đang bán"
          icon={Palette}
        />
        <StatsCard
          title="Tổng người dùng"
          value={data.stats.totalUsers}
          subtitle="Đã đăng ký"
          icon={Users}
        />
      </div>

      {/* Recent Orders Table */}
      <RecentOrders orders={data.recentOrders} />
    </div>
  )
}
