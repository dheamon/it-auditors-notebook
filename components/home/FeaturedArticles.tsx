import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/types'
import ArticleCard from '@/components/ui/ArticleCard'

interface FeaturedArticlesProps {
  articles: Article[]
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (!articles.length) return null

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#1A365D' }}>Featured Articles</h2>
            <p className="text-gray-500 text-sm">Editor&apos;s picks on IT audit and technology risk</p>
          </div>
          <Link
            href="/articles"
            className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-indigo-700 transition-colors"
            style={{ color: '#6366F1' }}
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:gap-6">
          {articles[0] && <ArticleCard article={articles[0]} featured />}
          {articles.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link href="/articles" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: '#6366F1' }}>
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
