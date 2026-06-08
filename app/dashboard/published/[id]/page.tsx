import { notFound } from 'next/navigation'
import { getPublishedArticleById } from '@/lib/queries'
import PublishedEditorClient from './PublishedEditorClient'

export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}

export default async function PublishedEditorPage({ params }: Props) {
  const { id } = await params
  const article = await getPublishedArticleById(id).catch(() => null)
  if (!article) notFound()
  return <PublishedEditorClient article={article} />
}
