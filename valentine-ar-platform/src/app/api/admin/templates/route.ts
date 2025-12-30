/**
 * Admin Templates API - List & Create
 * GET /api/admin/templates - List all templates
 * POST /api/admin/templates - Create new template
 */

import { requireAdminAPI } from "@/lib/auth-middleware"
import { prisma } from "@/lib/prisma"
import { templateSchema } from "@/lib/validations/admin"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/admin/templates
 * List all templates (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdminAPI()

    const templates = await prisma.template.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        previewImage: true,
        previewVideo: true,
        polarProductId: true,
        isActive: true,
        sortOrder: true,
        availableEffects: true,
        availableMusic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            cards: true,
          },
        },
      },
    })

    return NextResponse.json({ templates })
  } catch (error) {
    // Handle auth errors (thrown as Response objects)
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to fetch templates:", error)
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/templates
 * Create new template (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdminAPI()

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

    // Create template
    const template = await prisma.template.create({
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

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    // Handle auth errors
    if (error instanceof Response) {
      return error
    }

    console.error("Failed to create template:", error)
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    )
  }
}
