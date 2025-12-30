/**
 * Admin Users API
 * GET /api/admin/users - List all users
 */

import { requireAdminAPI } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/admin/users
 * List all users with their roles and stats
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdminAPI()

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            cards: true,
          },
        },
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    // Handle auth errors
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
