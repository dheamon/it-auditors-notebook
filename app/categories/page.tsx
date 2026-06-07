import type { Metadata } from 'next'
import CategoriesPageGrid from './CategoriesPageGrid'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all topic categories including IT Audit, SOC Reports, Cybersecurity, and more.',
}

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1A365D' }}>Categories</h1>
        <p className="text-gray-600 text-sm md:text-base">Explore articles by topic area.</p>
      </div>
      <CategoriesPageGrid />
    </div>
  )
}
