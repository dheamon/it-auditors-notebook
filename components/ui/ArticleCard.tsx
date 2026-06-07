import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock } from 'lucide-react'
import type { Article } from '@/types'
import { formatDateShort, estimateReadingTime } from '@/lib/utils'
import { urlForImage } from '@/lib/sanity'
import CategoryBadge from './CategoryBadge'

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const readingTime = article.estimatedReadingTime || estimateReadingTime(article.content || [])
  const imageUrl = urlForImage(article.featuredImage, featured ? 1200 : 800, featured ? 630 : 450)

  if (featured) {
    return (
      <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col lg:flex-row">
        <Link href={`/articles/${article.slug.current}`} className="relative lg:w-1/2 h-56 lg:h-auto overflow-hidden block">
          <Image
            src={imageUrl}
            alt={article.featuredImage?.alt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Link>
        <div className="p-6 lg:w-1/2 flex flex-col justify-between">
          <div>
            {article.category && (
              <CategoryBadge name={article.category.name} slug={article.category.slug?.current} size="sm" className="mb-3" />
            )}
            <h2 className="text-xl font-bold mb-3 transition-colors line-clamp-3" style={{ color: '#1A365D' }}>
              <Link href={`/articles/${article.slug.current}`}>{article.title}</Link>
            </h2>
            {article.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.excerpt}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateShort(article.publishedDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min read
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/articles/${article.slug.current}`} className="relative h-48 overflow-hidden block">
        <Image
          src={imageUrl}
          alt={article.featuredImage?.alt || article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        {article.category && (
          <CategoryBadge name={article.category.name} slug={article.category.slug?.current} size="sm" className="mb-3 self-start" />
        )}
        <h2 className="text-base font-bold mb-2 transition-colors line-clamp-3 flex-1" style={{ color: '#1A365D' }}>
          <Link href={`/articles/${article.slug.current}`}>{article.title}</Link>
        </h2>
        {article.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDateShort(article.publishedDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readingTime} min read
          </span>
        </div>
      </div>
    </article>
  )
}
