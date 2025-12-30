"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, Menu, User } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 fill-valentine-500 text-valentine-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-valentine-500 to-pink-500 bg-clip-text text-transparent">
              Valentine AR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-valentine-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium text-gray-700 hover:text-valentine-500 transition-colors"
            >
              Templates
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-valentine-500 transition-colors"
              >
                My Cards
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{session.user?.name || session.user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">My Cards</Link>
                  </DropdownMenuItem>
                  {session.user?.email && (
                    <DropdownMenuItem disabled>
                      {session.user.email}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn()} variant="default">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-valentine-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/templates"
                className="text-sm font-medium text-gray-700 hover:text-valentine-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-valentine-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Cards
                </Link>
              )}
              <div className="pt-4 border-t">
                {session ? (
                  <Button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      signIn()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
