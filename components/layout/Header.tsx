'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-primary-DEFAULT border-b border-primary-600 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight group">
            <span className="text-white font-bold text-lg group-hover:text-accent-300 transition-colors">
              {siteConfig.siteName}
            </span>
            <span className="text-primary-200 text-xs">{siteConfig.tagline}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-accent-DEFAULT text-white'
                    : 'text-primary-100 hover:text-white hover:bg-primary-600'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 text-primary-200 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              className="md:hidden p-2 text-primary-200 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-600 bg-primary-600">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2 rounded text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-accent-DEFAULT text-white'
                    : 'text-primary-100 hover:text-white hover:bg-primary-500'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded text-sm font-medium text-primary-100 hover:text-white hover:bg-primary-500 flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Search
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
