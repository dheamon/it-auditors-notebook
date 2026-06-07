import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 md:py-24 text-center">
      <div className="text-6xl md:text-7xl font-black mb-4" style={{ color: '#1A365D' }}>404</div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 text-sm md:text-base">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          style={{ background: '#1A365D' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link
          href="/articles"
          className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          Browse Articles
        </Link>
      </div>
    </div>
  )
}
