import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all topic categories including IT Audit, SOC Reports, Cybersecurity, and more.',
}

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT mb-3">Categories</h1>
        <p className="text-gray-600">Explore articles by topic area.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group block bg-white border border-gray-100 rounded-xl p-6 hover:border-accent-DEFAULT hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-semibold text-primary-DEFAULT group-hover:text-accent-DEFAULT transition-colors mb-2">
              {cat.name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{cat.description}</p>
            <span className="inline-flex items-center gap-1 text-sm text-accent-DEFAULT font-medium">
              Browse articles <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
