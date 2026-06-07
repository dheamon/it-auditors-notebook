import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import FeaturedArticles from '@/components/home/FeaturedArticles'
import LatestArticles from '@/components/home/LatestArticles'
import CategoriesGrid from '@/components/home/CategoriesGrid'
import NewsletterSignup from '@/components/ui/NewsletterSignup'
import { getFeaturedArticles, getLatestArticles } from '@/lib/queries'

export const revalidate = 3600

export default async function HomePage() {
  const [featuredArticles, latestArticles] = await Promise.all([
    getFeaturedArticles().catch(() => []),
    getLatestArticles(6).catch(() => []),
  ])

  return (
    <>
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedArticles articles={featuredArticles} />
      </Suspense>
      <CategoriesGrid />
      <Suspense fallback={<SectionSkeleton />}>
        <LatestArticles articles={latestArticles} />
      </Suspense>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </div>
    </>
  )
}

function SectionSkeleton() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
