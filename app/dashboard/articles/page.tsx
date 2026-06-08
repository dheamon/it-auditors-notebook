import type { Metadata } from 'next'
import { getDrafts } from '@/lib/draft-queries'
import { getPublishedArticlesList } from '@/lib/queries'
import type { DraftArticle } from '@/types'
import type { PublishedArticleSummary } from '@/lib/queries'
import ArticlesClient from './ArticlesClient'

export const metadata: Metadata = {
  title: 'Articles — Dashboard',
  robots: { index: false, follow: false },
}

export const revalidate = 0

export default async function ArticlesPage() {
  const [drafts, published] = await Promise.all([
    getDrafts().catch(() => [] as DraftArticle[]),
    getPublishedArticlesList().catch(() => [] as PublishedArticleSummary[]),
  ])
  return <ArticlesClient initialDrafts={drafts} publishedArticles={published} />
}
