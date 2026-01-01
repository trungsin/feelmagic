import { describe, it, expect } from 'vitest'
import { cn, formatPrice } from './utils'
import { Decimal } from '@prisma/client/runtime/library'

describe('utils', () => {
    describe('cn', () => {
        it('merges class names correctly', () => {
            expect(cn('a', 'b')).toBe('a b')
            expect(cn('a', { b: true, c: false })).toBe('a b')
            expect(cn('px-2 py-2', 'p-4')).toBe('p-4')
        })
    })

    describe('formatPrice', () => {
        it('converts numbers correctly', () => {
            expect(formatPrice(10)).toBe(10)
        })

        it('converts Decimal to number', () => {
            const decimal = new Decimal(10.5)
            expect(formatPrice(decimal)).toBe(10.5)
        })
    })
})
