import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { searchArticles } from '@/lib/queries'
import { formatDateShort, estimateReadingTime } from '@/lib/utils'
import CategoryBadge from '@/components/ui/CategoryBadge'

interface Props {
  query: string
}

export default async function SearchResults({ query }: Props) {
  if (!query.trim()) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-4xl mb-4">🔍</p>
        <p>Enter a search term to find articles.</p>
      </div>
    )
  }

  const results = await searchArticles(query).catch(() => [])

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">😕</p>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">No results for &ldquo;{query}&rdquo;</h2>
        <p className="text-gray-500 text-sm">Try different keywords or browse by category.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-5">
        {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </p>
      <div className="space-y-3 md:space-y-4">
        {results.map((article) => {
          const rt = estimateReadingTime(article.content || [])
          return (
            <article key={article._id} className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 hover:shadow-sm transition-shadow">
              {article.category && (
                <div className="mb-2">
                  <CategoryBadge name={article.category.name} slug={article.category.slug?.current} size="sm" />
                </div>
              )}
              <h2 className="font-bold mb-1 hover:text-indigo-600 transition-colors text-sm md:text-base" style={{ color: '#1A365D' }}>
                <Link href={`/articles/${article.slug.current}`}>{article.title}</Link>
              </h2>
              {article.excerpt && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateShort(article.publishedDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {rt} min read
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
