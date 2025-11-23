"use client"

import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">⚡</span>
            <span className="hidden sm:inline">HardwareTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Dashboard Button */}
          <button className="hidden sm:block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Dashboard
          </button>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
            <Link href="/" className="block px-4 py-2 hover:bg-muted rounded-lg">
              Home
            </Link>
            <Link href="#" className="block px-4 py-2 hover:bg-muted rounded-lg">
              Products
            </Link>
            <Link href="#" className="block px-4 py-2 hover:bg-muted rounded-lg">
              Categories
            </Link>
            <Link href="#" className="block px-4 py-2 hover:bg-muted rounded-lg">
              About
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
