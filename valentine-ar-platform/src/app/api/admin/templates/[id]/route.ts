/**
 * Admin Template API - Individual Operations
 * GET /api/admin/templates/[id] - Get single template
 * PUT /api/admin/templates/[id] - Update template
 * DELETE /api/admin/templates/[id] - Delete template
 * PATCH /api/admin/templates/[id] - Toggle active status
 */

import { requireAdminAPI } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import {
  templateSchema,
  updateTemplateStatusSchema,
} from "@/lib/validations/admin"
import { NextRequest, NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/templates/[id]
 * Get single template by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAPI()

    const { id } = await context.params

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
            cards: true,
          },
        },
      },
    })

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ template })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to fetch template:", error)
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/templates/[id]
 * Update template
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAPI()

    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validationResult = templateSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if template exists
    const existing = await prisma.template.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      )
    }

    // Update template
    const template = await prisma.template.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        previewImage: data.previewImage,
        previewVideo: data.previewVideo || "",
        polarProductId: data.polarProductId || "",
        availableEffects: data.availableEffects,
        availableMusic: data.availableMusic,
        defaultConfig: data.defaultConfig as object || {},
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    })

    return NextResponse.json({ template })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to update template:", error)
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/templates/[id]
 * Delete template (soft delete by setting isActive = false)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAPI()

    const { id } = await context.params

    // Check if template exists
    const existing = await prisma.template.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      )
    }

    // Prevent deletion if has orders (safety check)
    if (existing._count.orders > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete template with existing orders",
          message: "Deactivate template instead",
        },
        { status: 400 }
      )
    }

    // Delete template
    await prisma.template.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to delete template:", error)
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/templates/[id]
 * Toggle template active status
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminAPI()

    const { id } = await context.params
    const body = await request.json()

    // Validate input
    const validationResult = updateTemplateStatusSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.format(),
        },
        { status: 400 }
      )
    }

    const { isActive } = validationResult.data

    // Update status
    const template = await prisma.template.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json({ template })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to update template status:", error)
    return NextResponse.json(
      { error: "Failed to update template status" },
      { status: 500 }
    )
  }
}
