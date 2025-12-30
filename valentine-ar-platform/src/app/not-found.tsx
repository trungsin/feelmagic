import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-pink-600">404</h1>
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/templates">Browse templates</Link>
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          <p>Lost? Try these popular pages:</p>
          <div className="flex gap-4 justify-center mt-2">
            <Link href="/templates" className="hover:text-pink-600">Templates</Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-pink-600">Dashboard</Link>
            <span>•</span>
            <Link href="/" className="hover:text-pink-600">Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: '404 - Page Not Found | Valentine AR',
  description: 'The page you are looking for does not exist.',
}
