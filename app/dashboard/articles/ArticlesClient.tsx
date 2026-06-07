'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Search,
  Pencil,
  Copy,
  Trash2,
  ArrowUpDown,
  FileText,
  Loader2,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { DraftArticle } from '@/types'

type SortKey = 'newest' | 'oldest' | 'most-words'

interface Props {
  initialDrafts: DraftArticle[]
}

function StatusBadge({ status }: { status: DraftArticle['status'] }) {
  const map = {
    draft: { label: 'Draft', bg: '#F3F4F6', color: '#6B7280' },
    review: { label: 'Review', bg: '#FEF3C7', color: '#92400E' },
    published: { label: 'Published', bg: '#D1FAE5', color: '#065F46' },
  }
  const s = map[status] ?? map.draft
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

export default function ArticlesClient({ initialDrafts }: Props) {
  const router = useRouter()
  const [drafts, setDrafts] = useState<DraftArticle[]>(initialDrafts)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...drafts]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        d =>
          d.title?.toLowerCase().includes(q) ||
          d.category?.toLowerCase().includes(q) ||
          d.tags?.some(t => t.toLowerCase().includes(q))
      )
    }

    if (sort === 'newest') list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    if (sort === 'oldest') list.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
    if (sort === 'most-words') list.sort((a, b) => (b.wordCount ?? 0) - (a.wordCount ?? 0))

    return list
  }, [drafts, search, sort])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title || 'Untitled Draft'}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/dashboard/drafts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setDrafts(prev => prev.filter(d => d._id !== id))
      } else {
        alert('Failed to delete. Please try again.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  async function handleDuplicate(draft: DraftArticle) {
    setDuplicatingId(draft._id)
    try {
      const res = await fetch('/api/dashboard/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${draft.title || 'Untitled'} (copy)`,
          excerpt: draft.excerpt || '',
          content: draft.content || '',
          category: draft.category || '',
          tags: draft.tags || [],
          wordCount: draft.wordCount ?? 0,
        }),
      })
      if (res.ok) {
        const newDraft = await res.json()
        router.push(`/dashboard/articles/${newDraft._id}`)
      } else {
        alert('Failed to duplicate. Please try again.')
      }
    } finally {
      setDuplicatingId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1A365D' }}>
          Articles
        </h1>
        <Link
          href="/dashboard/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90 self-start sm:self-auto"
          style={{ background: '#6366F1' }}
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search by title, category, or tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="pl-9 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="most-words">Most words</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500 mb-3">
        {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-16 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {search ? `No articles match "${search}"` : 'No articles yet. Create your first one!'}
          </p>
          {!search && (
            <Link
              href="/dashboard/articles/new"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium px-4 py-2 rounded-lg text-white"
              style={{ background: '#6366F1' }}
            >
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div
            className="hidden sm:grid grid-cols-[1fr_140px_90px_80px_100px] gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100"
          >
            <span>Title</span>
            <span>Updated</span>
            <span>Words</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map(draft => (
              <div
                key={draft._id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_140px_90px_80px_100px] gap-2 sm:gap-4 px-4 py-4 hover:bg-gray-50 transition items-center"
              >
                {/* Title */}
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/articles/${draft._id}`}
                    className="text-sm font-medium hover:text-indigo-600 transition truncate block"
                    style={{ color: '#1A202C' }}
                  >
                    {draft.title || 'Untitled Draft'}
                  </Link>
                  {draft.category && (
                    <span className="text-xs text-gray-400">{draft.category}</span>
                  )}
                </div>

                {/* Updated */}
                <span className="text-xs text-gray-500">
                  {draft.updatedAt ? formatDate(draft.updatedAt) : '—'}
                </span>

                {/* Words */}
                <span className="text-xs text-gray-500">
                  {draft.wordCount ? draft.wordCount.toLocaleString() : '—'}
                </span>

                {/* Status */}
                <div>
                  <StatusBadge status={draft.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:justify-end">
                  {/* Open */}
                  <Link
                    href={`/dashboard/articles/${draft._id}`}
                    className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Open editor"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(draft)}
                    disabled={duplicatingId === draft._id}
                    className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                    title="Duplicate"
                  >
                    {duplicatingId === draft._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(draft._id, draft.title || '')}
                    disabled={deletingId === draft._id}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === draft._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
