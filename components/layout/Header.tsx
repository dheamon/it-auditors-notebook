'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'
import { siteConfig } from '@/lib/config'

const navItems = [
  { label: 'Home',       href: '/'           },
  { label: 'Articles',   href: '/articles'   },
  { label: 'Categories', href: '/categories' },
  { label: 'About',      href: '/about'      },
  { label: 'Contact',    href: '/contact'    },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-50 shadow-md"
      style={{ background: '#1A365D', borderBottom: '1px solid #152C4E' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight group">
            <span className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
              {siteConfig.siteName}
            </span>
            <span className="text-xs" style={{ color: '#91AADB' }}>{siteConfig.tagline}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded text-sm font-medium transition-colors"
                style={
                  pathname === item.href
                    ? { background: '#6366F1', color: '#fff' }
                    : { color: '#C8D6EC' }
                }
                onMouseEnter={e => {
                  if (pathname !== item.href)
                    e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  if (pathname !== item.href)
                    e.currentTarget.style.color = '#C8D6EC'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 transition-colors"
              aria-label="Search"
              style={{ color: '#91AADB' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#91AADB')}
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              className="md:hidden p-2 transition-colors"
              style={{ color: '#91AADB' }}
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
        <div style={{ background: '#152C4E', borderTop: '1px solid #10213A' }}>
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded text-sm font-medium transition-colors"
                style={
                  pathname === item.href
                    ? { background: '#6366F1', color: '#fff' }
                    : { color: '#C8D6EC' }
                }
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
              style={{ color: '#C8D6EC' }}
            >
              <Search className="w-4 h-4" /> Search
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
