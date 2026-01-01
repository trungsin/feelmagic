import { render, screen } from '@testing-library/react'
import { Button } from './button'
import { describe, it, expect } from 'vitest'

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('applies variant classes', () => {
        render(<Button variant="destructive">Destructive</Button>)
        const button = screen.getByText('Destructive')
        expect(button).toHaveClass('bg-destructive')
    })
})
