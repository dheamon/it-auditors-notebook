import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl font-black text-primary-DEFAULT mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="inline-flex items-center gap-2 bg-primary-DEFAULT text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link href="/articles" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-accent-DEFAULT hover:text-accent-DEFAULT transition-colors">
          Browse Articles
        </Link>
      </div>
    </div>
  )
}
