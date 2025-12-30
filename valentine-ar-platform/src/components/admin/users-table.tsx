/**
 * Users Table Component
 * Display users with role management
 */

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Shield, ShieldAlert } from "lucide-react"

type User = {
  id: string
  name: string | null
  email: string
  role: string
  image: string | null
  createdAt: string
  _count: {
    orders: number
    cards: number
  }
}

type RoleChangeDialog = {
  user: User
  newRole: "USER" | "ADMIN"
} | null

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [roleDialog, setRoleDialog] = useState<RoleChangeDialog>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Fetch users
  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/users")
      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setUsers(data.users)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange() {
    if (!roleDialog) return

    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${roleDialog.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleDialog.newRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to update role")
      }

      toast({
        title: "Thành công",
        description: `Role đã được cập nhật thành ${roleDialog.newRole}`,
      })

      fetchUsers()
      setRoleDialog(null)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể cập nhật role",
      })
    } finally {
      setActionLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">Đang tải...</div>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">
          Chưa có người dùng nào
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">User</th>
                <th className="p-4 text-left text-sm font-medium">Email</th>
                <th className="p-4 text-left text-sm font-medium">Role</th>
                <th className="p-4 text-left text-sm font-medium">Stats</th>
                <th className="p-4 text-left text-sm font-medium">
                  Created At
                </th>
                <th className="p-4 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {(user.name || user.email)[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="font-medium">
                        {user.name || "No name"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {user.role === "ADMIN" ? (
                        <Shield className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ShieldAlert className="h-4 w-4 text-gray-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          user.role === "ADMIN"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">
                      {user._count.orders} orders, {user._count.cards} cards
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <Select
                        value={user.role}
                        onValueChange={(newRole: "USER" | "ADMIN") =>
                          setRoleDialog({ user, newRole })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={!!roleDialog}
        onOpenChange={() => !actionLoading && setRoleDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi role</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn thay đổi role của{" "}
              <strong>{roleDialog?.user.name || roleDialog?.user.email}</strong>{" "}
              thành <strong>{roleDialog?.newRole}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialog(null)}
              disabled={actionLoading}
            >
              Hủy
            </Button>
            <Button onClick={handleRoleChange} disabled={actionLoading}>
              {actionLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
