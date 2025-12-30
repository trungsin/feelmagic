/**
 * Admin Layout
 * Protected layout cho toàn bộ admin pages
 * Verify admin role và render sidebar navigation
 */

import { requireAdmin } from "@/lib/auth-middleware"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import type { ReactNode } from "react"

export const metadata = {
  title: "Admin Panel - Valentine AR",
  description: "Admin dashboard for Valentine AR Platform",
}

interface AdminLayoutProps {
  children: ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Verify admin access - redirects if unauthorized
  await requireAdmin()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
