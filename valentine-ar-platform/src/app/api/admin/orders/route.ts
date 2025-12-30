/**
 * Admin Orders API
 * GET /api/admin/orders - List orders with filters
 */

import { requireAdminAPI } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import { orderFilterSchema } from "@/lib/validations/admin"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/admin/orders?status=PAID&page=1&limit=50
 * List orders with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdminAPI()

    const searchParams = request.nextUrl.searchParams
    const query = {
      status: searchParams.get("status") || "all",
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    }

    // Validate query params
    const validationResult = orderFilterSchema.safeParse(query)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid parameters",
          details: validationResult.error.format(),
        },
        { status: 400 }
      )
    }

    const { status, page, limit } = validationResult.data
    const skip = (page - 1) * limit

    // Build where clause
    const where =
      status === "all" ? {} : { status: status as "PENDING" | "PAID" | "FAILED" | "REFUNDED" }

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          template: {
            select: {
              title: true,
              previewImage: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    // Handle auth errors
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to fetch orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
