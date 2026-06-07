import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Calendar, BookOpen, Plus, ArrowRight, Clock } from 'lucide-react'
import { getDrafts, getDraftStats } from '@/lib/draft-queries'
import { formatDate } from '@/lib/utils'
import type { DraftArticle } from '@/types'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export const revalidate = 0

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold" style={{ color: '#1A365D' }}>
            {value}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: color + '20', color }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
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
      className="inline-block px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  )
}

export default async function DashboardPage() {
  const [stats, drafts] = await Promise.all([
    getDraftStats().catch(() => ({ totalDrafts: 0, articlesThisMonth: 0, totalWords: 0 })),
    getDrafts().catch(() => [] as DraftArticle[]),
  ])

  const recent = drafts.slice(0, 8)

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A365D' }}>
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
          style={{ background: '#6366F1' }}
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Drafts"
          value={stats.totalDrafts}
          icon={FileText}
          color="#6366F1"
        />
        <StatCard
          label="Articles This Month"
          value={stats.articlesThisMonth}
          icon={Calendar}
          color="#1A365D"
        />
        <StatCard
          label="Total Words Written"
          value={stats.totalWords.toLocaleString()}
          icon={BookOpen}
          color="#059669"
        />
      </div>

      {/* Recent drafts */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold" style={{ color: '#1A365D' }}>
            Recent Drafts
          </h2>
          <Link
            href="/dashboard/articles"
            className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition"
            style={{ color: '#6366F1' }}
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">No drafts yet. Start writing!</p>
            <Link
              href="/dashboard/articles/new"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-white"
              style={{ background: '#6366F1' }}
            >
              <Plus className="w-4 h-4" />
              New Article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map(draft => (
              <Link
                key={draft._id}
                href={`/dashboard/articles/${draft._id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group"
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate group-hover:text-indigo-600 transition"
                    style={{ color: '#1A202C' }}
                  >
                    {draft.title || 'Untitled Draft'}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {draft.updatedAt ? formatDate(draft.updatedAt) : '—'}
                    </span>
                    {draft.wordCount !== undefined && draft.wordCount > 0 && (
                      <span className="text-xs text-gray-400">
                        {draft.wordCount.toLocaleString()} words
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={draft.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
