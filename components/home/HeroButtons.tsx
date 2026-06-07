'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        href="/articles"
        className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        style={{ background: '#6366F1' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#4547D6')}
        onMouseLeave={e => (e.currentTarget.style.background = '#6366F1')}
      >
        Read Articles
        <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href="/about"
        className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
      >
        About the Author
      </Link>
    </div>
  )
}
