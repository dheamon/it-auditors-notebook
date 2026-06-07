import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDraftById } from '@/lib/draft-queries'
import EditorClient from './EditorClient'

export const metadata: Metadata = {
  title: 'Editor — Dashboard',
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditorPage({ params }: Props) {
  const { id } = await params
  const draft = await getDraftById(id).catch(() => null)

  if (!draft) notFound()

  return <EditorClient draft={draft} />
}
