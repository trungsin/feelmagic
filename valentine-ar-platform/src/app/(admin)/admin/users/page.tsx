/**
 * Users Management Page
 * /admin/users
 */

import { requireAdmin } from "@/lib/auth-middleware"
import { UsersTable } from "@/components/admin/users-table"

export default async function UsersPage() {
  // Protect route
  await requireAdmin()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-gray-500">Quản lý người dùng và phân quyền</p>
      </div>

      {/* Users Table */}
      <UsersTable />
    </div>
  )
}
