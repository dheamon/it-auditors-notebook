'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/config'

export default function CategoriesPageGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className="group block bg-white border border-gray-100 rounded-xl p-5 md:p-6 hover:shadow-md transition-all"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366F1')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#F3F4F6')}
        >
          <h2
            className="text-base md:text-lg font-semibold mb-2 group-hover:text-indigo-600 transition-colors"
            style={{ color: '#1A365D' }}
          >
            {cat.name}
          </h2>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">{cat.description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: '#6366F1' }}>
            Browse articles <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      ))}
    </div>
  )
}
