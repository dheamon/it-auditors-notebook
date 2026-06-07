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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-DEFAULT">Featured Articles</h2>
            <p className="text-gray-500 mt-1">Editor&apos;s picks on IT audit and technology risk</p>
          </div>
          <Link
            href="/articles"
            className="hidden sm:flex items-center gap-1 text-accent-DEFAULT hover:text-accent-600 text-sm font-medium"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6">
          {articles[0] && (
            <ArticleCard article={articles[0]} featured />
          )}
          {articles.length > 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              {articles.slice(1).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-accent-DEFAULT hover:text-accent-600 text-sm font-medium"
          >
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
