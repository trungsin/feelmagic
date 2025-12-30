/**
 * Admin Panel Validation Schemas
 * Zod schemas cho các API endpoints của Admin
 */

import { z } from "zod"

/**
 * Template Create/Update Schema
 * Validation cho tạo mới và cập nhật template
 */
export const templateSchema = z.object({
  title: z
    .string()
    .min(3, "Tên phải có ít nhất 3 ký tự")
    .max(100, "Tên không được quá 100 ký tự"),

  description: z
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả không được quá 500 ký tự"),

  price: z
    .number()
    .positive("Giá phải lớn hơn 0")
    .min(0.99, "Giá tối thiểu là $0.99")
    .max(999.99, "Giá tối đa là $999.99"),

  previewImage: z
    .string()
    .url("URL hình ảnh không hợp lệ")
    .min(1, "URL hình ảnh là bắt buộc"),

  previewVideo: z
    .string()
    .url("URL video không hợp lệ")
    .optional()
    .or(z.literal("")),

  polarProductId: z
    .string()
    .min(1, "Polar Product ID là bắt buộc")
    .regex(/^pol_/, "Product ID phải bắt đầu bằng 'pol_'")
    .optional()
    .or(z.literal("")), // Allow empty for now (Phase 3 feature)

  availableEffects: z
    .array(z.string())
    .default([]),

  availableMusic: z
    .array(z.string())
    .default([]),

  defaultConfig: z
    .record(z.unknown())
    .optional()
    .default({}),

  isActive: z
    .boolean()
    .default(true),

  sortOrder: z
    .number()
    .int("Sort order phải là số nguyên")
    .default(0),
})

/**
 * Update Template Status Schema
 * Cho việc toggle active/inactive status
 */
export const updateTemplateStatusSchema = z.object({
  isActive: z.boolean(),
})

/**
 * Update User Role Schema
 * Validation cho thay đổi role của user
 */
export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"], {
    errorMap: () => ({ message: "Role phải là USER hoặc ADMIN" }),
  }),
})

/**
 * Order Filter Schema
 * Validation cho query parameters của orders endpoint
 */
export const orderFilterSchema = z.object({
  status: z
    .enum(["PENDING", "PAID", "FAILED", "REFUNDED", "all"])
    .default("all"),

  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().default(1)),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().int().positive().max(100).default(50)),
})

// ============ TypeScript Types ============

/**
 * Inferred types từ schemas
 * Sử dụng cho TypeScript type safety
 */
export type TemplateInput = z.infer<typeof templateSchema>
export type UpdateTemplateStatusInput = z.infer<typeof updateTemplateStatusSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type OrderFilterInput = z.infer<typeof orderFilterSchema>
