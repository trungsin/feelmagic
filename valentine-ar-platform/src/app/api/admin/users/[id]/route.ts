/**
 * Admin User API - Update Role
 * PUT /api/admin/users/[id] - Update user role
 */

import { requireAdminAPI } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import { updateUserRoleSchema } from "@/lib/validations/admin"
import { NextRequest, NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * PUT /api/admin/users/[id]
 * Update user role (prevent self-demotion)
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { user: currentUser } = await requireAdminAPI()

    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validationResult = updateUserRoleSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      )
    }

    const { role } = validationResult.data

    // Prevent self-demotion
    if (id === currentUser.id && role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Self-demotion not allowed",
          message: "Bạn không thể tự giáng cấp mình",
        },
        { status: 400 }
      )
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    // Handle auth errors
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to update user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
}
