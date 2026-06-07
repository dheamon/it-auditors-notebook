import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ui/ArticleCard'
import { getCategoryBySlug, getArticlesByCategory, getCategorySlugs } from '@/lib/queries'
import { CATEGORIES } from '@/lib/config'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const staticCat = CATEGORIES.find((c) => c.slug === slug)
  return {
    title: staticCat?.name || 'Category',
    description: staticCat?.description || '',
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug).catch(() => null),
    getArticlesByCategory(slug).catch(() => []),
  ])

  const staticCat = CATEGORIES.find((c) => c.slug === slug)
  if (!category && !staticCat) notFound()

  const displayName = category?.name || staticCat?.name || slug
  const displayDesc = category?.description || staticCat?.description || ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-block bg-accent-50 text-accent-DEFAULT text-sm font-medium px-3 py-1 rounded-full mb-3 border border-accent-200">
          Category
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT mb-3">{displayName}</h1>
        {displayDesc && <p className="text-gray-600 max-w-2xl">{displayDesc}</p>}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📂</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No articles in this category yet</h2>
          <p className="text-gray-500">Check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
