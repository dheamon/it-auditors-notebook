import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Article } from '@/types'
import ArticleCard from '@/components/ui/ArticleCard'

interface LatestArticlesProps {
  articles: Article[]
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  if (!articles.length) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-DEFAULT">Latest Articles</h2>
            <p className="text-gray-500 mt-1">Fresh perspectives on audit and technology risk</p>
          </div>
          <Link
            href="/articles"
            className="hidden sm:flex items-center gap-1 text-accent-DEFAULT hover:text-accent-600 text-sm font-medium"
          >
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 bg-primary-DEFAULT text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Browse All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
