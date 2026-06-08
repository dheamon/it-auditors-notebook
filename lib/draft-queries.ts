import { writeClient } from './write-client'
import type { DraftArticle } from '@/types'

const DRAFT_FIELDS = `
  _id, title, slug, status, category, tags,
  createdAt, updatedAt, wordCount, excerpt
`

export async function getDrafts(): Promise<DraftArticle[]> {
  return writeClient.fetch<DraftArticle[]>(
    `*[_type == "draftArticle"] | order(updatedAt desc) { ${DRAFT_FIELDS} }`
  )
}

export async function getDraftById(id: string): Promise<DraftArticle | null> {
  return writeClient.fetch<DraftArticle | null>(
    `*[_type == "draftArticle" && _id == $id][0]`,
    { id }
  )
}

export async function getDraftStats(): Promise<{
  totalDrafts: number
  articlesThisMonth: number
  totalWords: number
  publishedCount: number
}> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [all, thisMonth, publishedCount] = await Promise.all([
    writeClient.fetch<Array<{ wordCount?: number }>>(
      `*[_type == "draftArticle"] { wordCount }`
    ),
    writeClient.fetch<number>(
      `count(*[_type == "draftArticle" && createdAt >= $startOfMonth])`,
      { startOfMonth }
    ),
    writeClient.fetch<number>(
      `count(*[_type == "article" && defined(publishedDate) && defined(slug.current)])`
    ),
  ])

  const totalDrafts = all.length
  const totalWords = all.reduce((sum, d) => sum + (d.wordCount ?? 0), 0)

  return { totalDrafts, articlesThisMonth: thisMonth, totalWords, publishedCount }
}
