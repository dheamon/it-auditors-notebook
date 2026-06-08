'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Tag,
  X,
  ChevronRight,
  BarChart3,
  FileText,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/config'
import { validateArticle, countWords, estimateReadTime } from '@/lib/validation'
import type { PublishedArticleForEdit } from '@/lib/queries'
import type { ValidationReport, ValidationStatus } from '@/lib/validation'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const AUTOSAVE_DELAY = 15_000

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

function UpdateStatus({ status, lastSaved }: { status: string; lastSaved: Date | null }) {
  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-gray-500">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Updating…
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-red-600">
        <AlertCircle className="w-3.5 h-3.5" />
        Update failed
      </span>
    )
  }
  if (status === 'unsaved') {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-600">
        <Clock className="w-3.5 h-3.5" />
        Unsaved changes
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-green-600">
      <CheckCircle className="w-3.5 h-3.5" />
      {lastSaved
        ? `Updated ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : 'Up to date'}
    </span>
  )
}

const STATUS_STYLES: Record<ValidationStatus, { bg: string; color: string; dot: string; label: string }> = {
  good: { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E', label: 'Good' },
  warning: { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B', label: 'Warning' },
  'needs-attention': { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444', label: 'Needs attention' },
}

function CheckCard({ name, status, value, message, tip }: {
  name: string; status: ValidationStatus; value: string; message: string; tip?: string
}) {
  const s = STATUS_STYLES[status]
  return (
    <div className="rounded-lg border p-3" style={{ background: s.bg, borderColor: s.dot + '40' }}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-700">{name}</span>
        <span className="text-xs font-medium px-1.5 py-0.5 rounded whitespace-nowrap"
          style={{ background: s.dot + '25', color: s.color }}>
          {value}
        </span>
      </div>
      <p className="text-xs" style={{ color: s.color }}>{message}</p>
      {tip && <p className="text-xs text-gray-500 mt-1 italic">{tip}</p>}
    </div>
  )
}

function ValidationSection({ title, checks }: { title: string; checks: ValidationReport['readability'] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{title}</h4>
      <div className="space-y-2">
        {checks.map(c => <CheckCard key={c.name} {...c} />)}
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? '#15803D' : score >= 50 ? '#D97706' : '#DC2626'
  const bg = score >= 75 ? '#F0FDF4' : score >= 50 ? '#FFFBEB' : '#FEF2F2'
  const label = score >= 75 ? 'Strong' : score >= 50 ? 'Developing' : 'Needs work'
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg mb-4" style={{ background: bg }}>
      <div>
        <p className="text-xs text-gray-500">Overall Score</p>
        <p className="text-lg font-bold" style={{ color }}>
          {score}<span className="text-xs font-normal ml-0.5">/100</span>
        </p>
      </div>
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: color + '20', color }}>{label}</span>
    </div>
  )
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('')

  function addTag(raw: string) {
    const tag = raw.trim()
    if (tag && !tags.includes(tag)) onChange([...tags, tag])
    setInput('')
  }
  function removeTag(t: string) { onChange(tags.filter(x => x !== t)) }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
    else if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1])
  }

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
      {tags.map(t => (
        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
          style={{ background: '#EEF2FF', color: '#4338CA' }}>
          <Tag className="w-2.5 h-2.5" />
          {t}
          <button type="button" onClick={() => removeTag(t)} className="ml-0.5 hover:text-red-600 transition">
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text" value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown} onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? 'Add tags (press Enter)' : ''}
        className="flex-1 min-w-[100px] text-xs outline-none bg-transparent placeholder:text-gray-400"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main PublishedEditorClient
// ─────────────────────────────────────────────────────────────────────────────

export default function PublishedEditorClient({ article }: { article: PublishedArticleForEdit }) {
  const router = useRouter()

  const [title, setTitle] = useState(article.title || '')
  const [category, setCategory] = useState(article.category?.name || '')
  const [tags, setTags] = useState<string[]>(article.tags || [])
  const [excerpt, setExcerpt] = useState(article.excerpt || '')
  const [content, setContent] = useState(article.markdownContent || '')

  const [leftTab, setLeftTab] = useState<'metadata' | 'validate'>('metadata')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [validation, setValidation] = useState<ValidationReport | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRef = useRef({ title, category, tags, excerpt, content })

  useEffect(() => {
    latestRef.current = { title, category, tags, excerpt, content }
  }, [title, category, tags, excerpt, content])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (saveStatus === 'unsaved') { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [saveStatus])

  // ── Update live article ───────────────────────────────────────
  const save = useCallback(async () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveStatus('saving')

    const { title: t, category: c, tags: tgs, excerpt: ex, content: ct } = latestRef.current

    try {
      const res = await fetch(`/api/dashboard/live/${article._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: t,
          category: c,
          tags: tgs,
          excerpt: ex,
          markdownContent: ct,
          slug: article.slug.current,  // needed for revalidatePath
        }),
      })
      if (!res.ok) throw new Error('Update failed')
      setSaveStatus('saved')
      setLastSaved(new Date())
    } catch {
      setSaveStatus('error')
    }
  }, [article._id, article.slug])

  const scheduleSave = useCallback(() => {
    setSaveStatus('unsaved')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(save, AUTOSAVE_DELAY)
  }, [save])

  function handleTitleChange(v: string)   { setTitle(v);    scheduleSave() }
  function handleCategoryChange(v: string){ setCategory(v); scheduleSave() }
  function handleTagsChange(v: string[])  { setTags(v);     scheduleSave() }
  function handleExcerptChange(v: string) { setExcerpt(v);  scheduleSave() }
  function handleContentChange(v: string | undefined) { setContent(v ?? ''); scheduleSave() }

  function runValidation() {
    setIsValidating(true)
    setLeftTab('validate')
    setTimeout(() => {
      setValidation(validateArticle(content, title, excerpt))
      setIsValidating(false)
    }, 50)
  }

  const wordCount = useMemo(() => countWords(content), [content])
  const readTime  = useMemo(() => estimateReadTime(wordCount), [wordCount])

  const inputCls =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white ' +
    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'

  const livePath = `/articles/${article.slug.current}`

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 130px)', minHeight: 500 }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 flex-shrink-0"
        style={{ background: '#fff' }}
      >
        {/* Back */}
        <button
          onClick={() => router.push('/dashboard/articles')}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition flex-shrink-0"
          title="Back to articles"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Title + live badge */}
        <span className="flex-1 text-sm text-gray-600 truncate min-w-0">
          {title || <span className="italic text-gray-400">Untitled</span>}
        </span>
        <span
          className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
          style={{ background: '#ECFDF5', color: '#059669' }}
        >
          Live
        </span>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400 flex-shrink-0">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{readTime} min read</span>
        </div>

        {/* Save status */}
        <div className="flex-shrink-0">
          <UpdateStatus status={saveStatus} lastSaved={lastSaved} />
        </div>

        {/* Validate */}
        <button
          onClick={runValidation}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex-shrink-0"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Validate
        </button>

        {/* Update Live button */}
        <button
          onClick={save}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60 flex-shrink-0"
          style={{ background: '#059669' }}
        >
          {saveStatus === 'saving' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {saveStatus === 'saving' ? 'Updating…' : 'Update Live'}
          </span>
        </button>

        {/* View Live */}
        <a
          href={livePath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition flex-shrink-0"
          title="View live article"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Live</span>
        </a>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

        {/* ── Left panel ──────────────────────────────────────── */}
        <div
          className="flex flex-col flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 w-full lg:w-72 max-h-[45vh] lg:max-h-none overflow-hidden"
          style={{ background: '#fff' }}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 flex-shrink-0">
              <button
                onClick={() => setLeftTab('metadata')}
                className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition"
                style={{
                  borderColor: leftTab === 'metadata' ? '#6366F1' : 'transparent',
                  color: leftTab === 'metadata' ? '#6366F1' : '#6B7280',
                }}
              >
                <FileText className="w-3.5 h-3.5" />
                Metadata
              </button>
              <button
                onClick={runValidation}
                className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition"
                style={{
                  borderColor: leftTab === 'validate' ? '#6366F1' : 'transparent',
                  color: leftTab === 'validate' ? '#6366F1' : '#6B7280',
                }}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Validate
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {leftTab === 'metadata' && (
                <div className="p-4 space-y-4">

                  {/* Slug (read-only) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Slug <span className="text-gray-400 font-normal">(cannot be changed)</span>
                    </label>
                    <p className="text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono truncate">
                      /articles/{article.slug.current}
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text" value={title}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="Article title…" className={inputCls}
                    />
                    <p className="mt-1 text-xs text-right"
                      style={{ color: title.length > 70 ? '#DC2626' : '#9CA3AF' }}>
                      {title.length}/70
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <select value={category} onChange={e => handleCategoryChange(e.target.value)}
                      className={inputCls + ' cursor-pointer'}>
                      <option value="">— Select category —</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.slug} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
                    <TagInput tags={tags} onChange={handleTagsChange} />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Excerpt / Meta Description
                    </label>
                    <textarea
                      value={excerpt} onChange={e => handleExcerptChange(e.target.value)}
                      rows={4}
                      placeholder="Brief description for search engines (120–160 chars)…"
                      className={inputCls + ' resize-none'} maxLength={300}
                    />
                    <p className="mt-1 text-xs text-right" style={{
                      color: excerpt.length > 160 ? '#D97706' : excerpt.length >= 120 ? '#15803D' : '#9CA3AF',
                    }}>
                      {excerpt.length}/160
                    </p>
                  </div>

                  {/* Mobile stats */}
                  <div className="sm:hidden flex gap-4 text-xs text-gray-400 pt-1">
                    <span>{wordCount.toLocaleString()} words</span>
                    <span>{readTime} min read</span>
                  </div>

                  <button onClick={runValidation}
                    className="sm:hidden w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Run Validation
                  </button>
                </div>
              )}

              {leftTab === 'validate' && (
                <div className="p-4">
                  {isValidating ? (
                    <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analysing…</span>
                    </div>
                  ) : validation ? (
                    <div className="space-y-5">
                      <ScoreBadge score={validation.score} />
                      <ValidationSection title="Readability" checks={validation.readability} />
                      <ValidationSection title="Structure"   checks={validation.structure} />
                      <ValidationSection title="SEO"         checks={validation.seo} />
                      <ValidationSection title="Writing Health" checks={validation.writing} />
                      <button onClick={runValidation}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                        <ChevronRight className="w-3.5 h-3.5" />
                        Re-run validation
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 mb-3">
                        Check this article's readability, structure, and SEO.
                      </p>
                      <button onClick={runValidation}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg"
                        style={{ background: '#6366F1' }}>
                        <BarChart3 className="w-4 h-4" />
                        Run Validation
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right panel (editor) ──────────────────────────────── */}
        <div className="flex-1 min-h-0 min-w-0 overflow-hidden" data-color-mode="light">
          {!article.markdownContent && (
            <div
              className="px-4 py-2 text-xs border-b border-amber-200 flex items-center gap-2"
              style={{ background: '#FFFBEB', color: '#92400E' }}
            >
              <span>⚠</span>
              This article was originally authored in Sanity Studio (block content).
              Editing here will set the markdown version — the block content is preserved as a fallback.
            </div>
          )}
          <MDEditor
            value={content}
            onChange={handleContentChange}
            height="100%"
            preview="live"
            style={{ height: '100%', borderRadius: 0, border: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
