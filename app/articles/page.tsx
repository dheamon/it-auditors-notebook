import type { Metadata } from 'next'
import ArticleCard from '@/components/ui/ArticleCard'
import { getAllArticles } from '@/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Browse all articles on IT audit, SOC reporting, cybersecurity, technology risk, and AI governance.',
}

export default async function ArticlesPage() {
  const articles = await getAllArticles().catch(() => [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT mb-3">Articles</h1>
        <p className="text-gray-600">
          Practical insights on IT audit, technology risk, SOC reporting, cybersecurity governance, and more.
        </p>
      </div>

      {articles.length === 0 ? (
        <EmptyState />
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

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">📝</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">No articles yet</h2>
      <p className="text-gray-500">Check back soon — content is on its way.</p>
    </div>
  )
}
