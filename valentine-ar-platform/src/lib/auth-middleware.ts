/**
 * Authentication & Authorization Middleware
 * Xác thực và phân quyền cho Admin Panel
 */

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

/**
 * Require authenticated user
 * Redirect to signin page if not authenticated
 *
 * @returns Session object
 * @throws Redirects to signin if no session
 */
export async function requireAuth() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/admin")
  }

  return session
}

/**
 * Require admin role for pages
 * Redirects based on authentication status:
 * - Not authenticated → /api/auth/signin
 * - Authenticated but not admin → / (home)
 *
 * @returns Session và user object
 * @throws Redirects if not admin
 */
export async function requireAdmin() {
  const session = await auth()

  // Check authentication
  if (!session?.user?.email) {
    redirect("/api/auth/signin?callbackUrl=/admin")
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  // Check if user exists and has admin role
  if (!user || user.role !== "ADMIN") {
    redirect("/") // Redirect to home if not admin
  }

  return { session, user }
}

/**
 * Require admin role for API routes
 * Throws Response object with appropriate status code:
 * - 401 Unauthorized if not authenticated
 * - 403 Forbidden if not admin
 *
 * @returns Session và user object
 * @throws Response with 401/403 status
 */
export async function requireAdminAPI() {
  const session = await auth()

  // Check authentication
  if (!session?.user?.email) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized", message: "Vui lòng đăng nhập" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  // Check admin role
  if (!user || user.role !== "ADMIN") {
    throw new Response(
      JSON.stringify({
        error: "Forbidden",
        message: "Bạn không có quyền truy cập",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    )
  }

  return { session, user }
}
