import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// Mock BackgroundType since it's an enum from @prisma/client
vi.mock('@prisma/client', () => ({
    BackgroundType: {
        COLOR: 'COLOR',
        IMAGE: 'IMAGE',
        VIDEO: 'VIDEO',
    },
}))

describe('POST /api/builder/save', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createRequest = (body: object) => {
        return {
            json: async () => body,
        } as any
    }

    it('should return 401 if unauthenticated', async () => {
        vi.mocked(auth as () => Promise<null>).mockResolvedValue(null)
        const req = createRequest({ cardId: 'card_123' })
        const res = await POST(req)
        expect(res.status).toBe(401)
    })

    it('should return 403 if user does not own the card', async () => {
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user_A' } } as any)
        vi.mocked(prisma.card.findUnique).mockResolvedValue({
            id: 'card_123',
            userId: 'user_B'
        } as any)

        const req = createRequest({
            cardId: 'card_123',
            recipientName: 'Test',
            senderName: 'Test',
            message: 'Test',
            backgroundType: 'COLOR'
        })
        const res = await POST(req)
        expect(res.status).toBe(403)
    })

    it('should save card successfully if owner', async () => {
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user_A' } } as any)
        vi.mocked(prisma.card.findUnique).mockResolvedValue({
            id: 'card_123',
            userId: 'user_A'
        } as any)
        vi.mocked(prisma.card.update).mockResolvedValue({ id: 'card_123' } as any)

        const req = createRequest({
            cardId: 'card_123',
            recipientName: 'Test',
            senderName: 'Test',
            message: 'Test',
            backgroundType: 'COLOR',
            backgroundColor: '#ff0000',
            arEffects: [],
            voiceTriggers: [],
            gestureTriggers: []
        })
        const res = await POST(req)

        expect(res.status).toBe(200)
        expect(prisma.card.update).toHaveBeenCalled()
    })
})
