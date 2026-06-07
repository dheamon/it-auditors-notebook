import type { Metadata } from 'next'
import { getDrafts } from '@/lib/draft-queries'
import type { DraftArticle } from '@/types'
import ArticlesClient from './ArticlesClient'

export const metadata: Metadata = {
  title: 'Articles — Dashboard',
  robots: { index: false, follow: false },
}

export const revalidate = 0

export default async function ArticlesPage() {
  const drafts = await getDrafts().catch(() => [] as DraftArticle[])
  return <ArticlesClient initialDrafts={drafts} />
}
