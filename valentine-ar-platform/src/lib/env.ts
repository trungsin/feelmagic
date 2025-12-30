import { z } from "zod"

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("Invalid DATABASE_URL"),

  // NextAuth
  NEXTAUTH_URL: z.string().url("Invalid NEXTAUTH_URL"),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

  // Google OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Polar Payment (optional in development)
  POLAR_ACCESS_TOKEN: z.string().optional(),
  POLAR_WEBHOOK_SECRET: z.string().optional(),

  // Public URLs (optional during build, required at runtime)
  NEXT_PUBLIC_URL: z.string().url("Invalid NEXT_PUBLIC_URL").optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Vercel Blob (optional)
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
})

// Validate environment variables
export function validateEnv() {
  try {
    const env = envSchema.parse(process.env)
    return { success: true as const, env }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))

      console.error('❌ Invalid environment variables:')
      issues.forEach(({ path, message }) => {
        console.error(`  - ${path}: ${message}`)
      })

      return { success: false as const, errors: issues }
    }

    throw error
  }
}

// Validate environment variables at module load time
// During build, some vars may not be available, so we use a relaxed validation
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'

export const env = isBuildTime
  ? (process.env as z.infer<typeof envSchema>) // Skip validation during build
  : envSchema.parse(process.env) // Validate at runtime

// Export types for TypeScript
export type Env = z.infer<typeof envSchema>
