'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  PenLine,
  LogOut,
  Menu,
  X,
  BookOpen,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/articles', label: 'Articles', icon: FileText, exact: false },
  { href: '/dashboard/articles/new', label: 'New Article', icon: PenLine, exact: true },
]

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact: boolean
  onClick?: () => void
}) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
      style={{
        background: active ? '#EEF2FF' : 'transparent',
        color: active ? '#6366F1' : '#4A5568',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = '#F3F4F6'
          e.currentTarget.style.color = '#1A365D'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#4A5568'
        }
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </Link>
  )
}

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{
          width: 224,
          background: '#fff',
          borderRight: '1px solid #E5E7EB',
          minHeight: '100%',
        }}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
              style={{ background: '#1A365D' }}
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#1A365D' }}>
              Author
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 transition-all"
            onMouseEnter={e => {
              e.currentTarget.style.background = '#FEF2F2'
              e.currentTarget.style.color = '#DC2626'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#6B7280'
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────── */}
      <div
        className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200"
        style={{ background: '#fff' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center w-6 h-6 rounded-md"
            style={{ background: '#1A365D' }}
          >
            <BookOpen className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold" style={{ color: '#1A365D' }}>
            Dashboard
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          style={{ top: 0 }}
        >
          {/* Overlay */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div
            className="w-64 flex flex-col shadow-xl"
            style={{ background: '#fff' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-sm font-semibold" style={{ color: '#1A365D' }}>
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded text-gray-500 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {NAV.map(item => (
                <NavLink
                  key={item.href}
                  {...item}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-gray-100">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
