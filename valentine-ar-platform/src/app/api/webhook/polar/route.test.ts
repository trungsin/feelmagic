import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'
import crypto from 'crypto'

describe('Polar Webhook', () => {
    const SECRET = 'test_secret'

    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubEnv('POLAR_WEBHOOK_SECRET', SECRET)
    })

    const createWebhookRequest = (body: object, signature?: string) => {
        const jsonBody = JSON.stringify(body)
        const headers = new Headers({
            'Content-Type': 'application/json',
        })

        if (signature) {
            headers.set('webhook-signature', signature)
        } else {
            const hmac = crypto.createHmac('sha256', SECRET)
            hmac.update(jsonBody)
            headers.set('webhook-signature', hmac.digest('hex'))
        }

        return {
            text: async () => jsonBody,
            headers,
            json: async () => body,
        } as any
    }

    it('should return 401 if signature is missing', async () => {
        const req = {
            text: async () => '{}',
            headers: new Headers(),
        } as any

        const res = await POST(req)
        expect(res.status).toBe(401)
    })

    it('should return 401 if signature is invalid', async () => {
        const req = createWebhookRequest({ type: 'order.created' }, 'invalid_sig')
        const res = await POST(req)
        expect(res.status).toBe(401)
    })

    it('should process order.created successfully', async () => {
        const VALID_CUID = 'ckv1234567890123456789012'
        const orderData = {
            id: 'ord_123',
            amount: 1000,
            currency: 'USD',
            customer_email: 'test@example.com',
            metadata: {
                templateId: VALID_CUID,
                userId: 'ckv1234567890123456789013',
            }
        }

        const body = {
            type: 'order.created',
            data: orderData
        }

        // Mock prisma responses
        vi.mocked(prisma.order.findUnique).mockResolvedValue(null)
        vi.mocked(prisma.order.create).mockResolvedValue({ id: 'order_123' } as any)
        vi.mocked(prisma.template.findUnique).mockResolvedValue({
            id: VALID_CUID,
            defaultConfig: {}
        } as any)
        vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) => {
            return cb(prisma)
        })

        const req = createWebhookRequest(body)
        const res = await POST(req)

        expect(res.status).toBe(200)
        expect(prisma.order.findUnique).toHaveBeenCalled()
        expect(prisma.template.findUnique).toHaveBeenCalled()
    })

    it('should be idempotent and not process same order twice', async () => {
        const orderData = {
            id: 'ord_123',
            amount: 1000,
            currency: 'USD',
            metadata: {
                templateId: 'clp1234567890123456789012',
                userId: 'clp1234567890123456789013',
            }
        }

        const body = {
            type: 'order.created',
            data: orderData
        }

        // Mock order already exists
        vi.mocked(prisma.order.findUnique).mockResolvedValue({ id: 'existing' } as any)

        const req = createWebhookRequest(body)
        const res = await POST(req)

        expect(res.status).toBe(200)
        // Should NOT call template.findUnique or transaction
        expect(prisma.template.findUnique).not.toHaveBeenCalled()
    })
})
