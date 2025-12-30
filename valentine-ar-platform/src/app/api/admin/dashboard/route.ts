/**
 * Admin Dashboard API
 * GET /api/admin/dashboard
 * Returns dashboard statistics và recent orders
 */

import { NextResponse } from "next/server"
import { requireAdminAPI } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Verify admin access
    await requireAdminAPI()

    // Fetch all dashboard data in parallel
    const [totalRevenue, totalOrders, activeTemplates, totalUsers, recentOrders] =
      await Promise.all([
        // Tổng doanh thu từ orders đã paid
        prisma.order.aggregate({
          where: { status: "PAID" },
          _sum: { amount: true },
        }),

        // Tổng số orders đã paid
        prisma.order.count({
          where: { status: "PAID" },
        }),

        // Số templates đang active
        prisma.template.count({
          where: { isActive: true },
        }),

        // Tổng số users
        prisma.user.count(),

        // 10 orders gần nhất (paid)
        prisma.order.findMany({
          where: { status: "PAID" },
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
            template: {
              select: {
                title: true,
              },
            },
          },
          orderBy: { paidAt: "desc" },
          take: 10,
        }),
      ])

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalOrders,
        activeTemplates,
        totalUsers,
      },
      recentOrders,
    })
  } catch (error) {
    // Error từ requireAdminAPI sẽ throw Response object
    if (error instanceof Response) {
      return error
    }

    console.error("Dashboard API error:", error)
    return NextResponse.json(
      { error: "Không thể lấy dữ liệu dashboard" },
      { status: 500 }
    )
  }
}
