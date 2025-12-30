/**
 * Stats Card Component
 * Hiển thị một metric với icon, value, và optional subtitle
 */

import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: number // Percentage change (optional)
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="p-2 bg-pink-50 rounded-lg">
          <Icon className="w-5 h-5 text-pink-600" />
        </div>
      </div>

      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}

        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-sm font-medium ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-gray-500">vs tháng trước</span>
          </div>
        )}
      </div>
    </div>
  )
}
