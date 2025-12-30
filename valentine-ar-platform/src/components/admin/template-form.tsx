/**
 * Template Form Component
 * Reusable form for creating/editing templates
 */

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { templateSchema, type TemplateInput } from "@/lib/validations/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

type TemplateFormProps = {
  initialData?: Partial<TemplateInput> & { id?: string }
  mode: "create" | "edit"
}

export function TemplateForm({ initialData, mode }: TemplateFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 9.99,
      previewImage: "",
      previewVideo: "",
      polarProductId: "",
      availableEffects: [],
      availableMusic: [],
      isActive: true,
      sortOrder: 0,
      ...initialData,
    },
  })

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof TemplateInput, value)
      })
    }
  }, [mode, initialData, setValue])

  async function onSubmit(data: TemplateInput) {
    try {
      const url =
        mode === "create"
          ? "/api/admin/templates"
          : `/api/admin/templates/${initialData?.id}`

      const method = mode === "create" ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to save template")
      }

      toast({
        title: "Thành công",
        description: `Template đã ${mode === "create" ? "tạo" : "cập nhật"} thành công`,
      })

      router.push("/admin/templates")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Có lỗi xảy ra",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Tên Template <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Valentine Hearts AR"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Mô tả <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Mô tả chi tiết về template..."
              rows={4}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">
              Giá (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="9.99"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Preview Image URL */}
          <div>
            <Label htmlFor="previewImage">
              Preview Image URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="previewImage"
              {...register("previewImage")}
              placeholder="https://example.com/image.jpg"
            />
            {errors.previewImage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.previewImage.message}
              </p>
            )}
          </div>

          {/* Preview Video URL */}
          <div>
            <Label htmlFor="previewVideo">Preview Video URL</Label>
            <Input
              id="previewVideo"
              {...register("previewVideo")}
              placeholder="https://example.com/video.mp4"
            />
            {errors.previewVideo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.previewVideo.message}
              </p>
            )}
          </div>

          {/* Polar Product ID */}
          <div>
            <Label htmlFor="polarProductId">Polar Product ID</Label>
            <Input
              id="polarProductId"
              {...register("polarProductId")}
              placeholder="pol_xxxxx"
            />
            {errors.polarProductId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.polarProductId.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Để trống nếu chưa tích hợp Polar
            </p>
          </div>

          {/* Available Effects (comma-separated) */}
          <div>
            <Label htmlFor="availableEffects">
              Available Effects (ngăn cách bởi dấu phẩy)
            </Label>
            <Input
              id="availableEffects"
              placeholder="hearts, sparkles, confetti"
              onChange={(e) => {
                const effects = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                setValue("availableEffects", effects)
              }}
              defaultValue={initialData?.availableEffects?.join(", ")}
            />
            <p className="mt-1 text-sm text-gray-500">
              Ví dụ: hearts, sparkles, confetti
            </p>
          </div>

          {/* Available Music (comma-separated) */}
          <div>
            <Label htmlFor="availableMusic">
              Available Music (ngăn cách bởi dấu phẩy)
            </Label>
            <Input
              id="availableMusic"
              placeholder="romantic1.mp3, love-song.mp3"
              onChange={(e) => {
                const music = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                setValue("availableMusic", music)
              }}
              defaultValue={initialData?.availableMusic?.join(", ")}
            />
            <p className="mt-1 text-sm text-gray-500">
              Ví dụ: romantic1.mp3, love-song.mp3
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.sortOrder && (
              <p className="mt-1 text-sm text-red-600">
                {errors.sortOrder.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Thứ tự hiển thị (số nhỏ hơn hiện trước)
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Kích hoạt template
            </Label>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Tạo Template" : "Cập nhật"}
        </Button>
      </div>
    </form>
  )
}
