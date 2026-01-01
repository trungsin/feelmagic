import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requireAuth, requireAdminAPI } from './auth-middleware'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

describe('auth-middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('requireAuth', () => {
        it('should redirect if not authenticated', async () => {
            // Mock auth to return null session
            vi.mocked(auth as () => Promise<null>).mockResolvedValue(null)

            try {
                await requireAuth()
            } catch (e) {
                // next/navigation redirect usually throws
            }

            expect(redirect).toHaveBeenCalledWith('/api/auth/signin?callbackUrl=/admin')
        })

        it('should return session if authenticated', async () => {
            const mockSession = { user: { email: 'test@example.com' } }
            vi.mocked(auth).mockResolvedValue(mockSession as any)

            const result = await requireAuth()
            expect(result).toEqual(mockSession)
        })
    })

    describe('requireAdminAPI', () => {
        it('should throw 401 if not authenticated', async () => {
            vi.mocked(auth as () => Promise<null>).mockResolvedValue(null)

            await expect(requireAdminAPI()).rejects.toThrow()
            // We check if it throws a Response with 401
            try {
                await requireAdminAPI()
            } catch (error: any) {
                expect(error.status).toBe(401)
            }
        })

        it('should throw 403 if user is not ADMIN', async () => {
            vi.mocked(auth).mockResolvedValue({ user: { email: 'user@example.com' } } as any)
            vi.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'USER' } as any)

            try {
                await requireAdminAPI()
            } catch (error: any) {
                expect(error.status).toBe(403)
            }
        })

        it('should return session and user if user is ADMIN', async () => {
            const mockSession = { user: { email: 'admin@example.com' } }
            const mockUser = { email: 'admin@example.com', role: 'ADMIN' }

            vi.mocked(auth).mockResolvedValue(mockSession as any)
            vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

            const result = await requireAdminAPI()
            expect(result.user.role).toBe('ADMIN')
            expect(result.session).toEqual(mockSession)
        })
    })
})
