import { notFound } from 'next/navigation'
import { getPublishedArticleById } from '@/lib/queries'
import { portableTextToMarkdown } from '@/lib/utils'
import PublishedEditorClient from './PublishedEditorClient'

export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}

export default async function PublishedEditorPage({ params }: Props) {
  const { id } = await params
  const article = await getPublishedArticleById(id).catch(() => null)
  if (!article) notFound()

  // If the article was authored in Sanity Studio (block content, no markdownContent),
  // convert the blocks to markdown so the editor isn't empty.
  const initialContent =
    article.markdownContent ||
    (article.content?.length ? portableTextToMarkdown(article.content) : '')

  return <PublishedEditorClient article={article} initialContent={initialContent} />
}
