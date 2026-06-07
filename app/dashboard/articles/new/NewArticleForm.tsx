'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/config'

const inputClass =
  'w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg bg-white ' +
  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'

export default function NewArticleForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('A title is required.'); return }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/dashboard/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          excerpt: excerpt.trim(),
        }),
      })

      if (!res.ok) throw new Error('Failed to create draft')

      const draft = await res.json()
      router.push(`/dashboard/articles/${draft._id}`)
    } catch {
      setError('Could not create draft. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          autoFocus
          placeholder="e.g. Understanding SOC 2 Type II Reports"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={inputClass + ' cursor-pointer'}
        >
          <option value="">— Select category —</option>
          {CATEGORIES.map(cat => (
            <option key={cat.slug} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1.5">
          Excerpt
          <span className="ml-1 text-xs font-normal text-gray-400">(optional — you can add this later)</span>
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          rows={3}
          placeholder="A short description of what this article covers…"
          className={inputClass + ' resize-none'}
          maxLength={300}
        />
        <p className="mt-1 text-xs text-gray-400 text-right">{excerpt.length}/300</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: '#6366F1' }}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'Creating…' : 'Create & Open Editor'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
