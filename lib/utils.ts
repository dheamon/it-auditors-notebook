import { type ClassValue, clsx } from 'clsx'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy')
  } catch {
    return dateString
  }
}

export function formatDateShort(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy')
  } catch {
    return dateString
  }
}

export function estimateReadingTime(content: unknown[]): number {
  if (!content || !Array.isArray(content)) return 1
  const text = content
    .map((block: unknown) => {
      const b = block as { _type?: string; children?: Array<{ text?: string }> }
      if (b._type !== 'block' || !b.children) return ''
      return b.children.map((c) => c.text || '').join('')
    })
    .join(' ')
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://it-auditors-notebook.vercel.app'
  return `${baseUrl}${path}`
}
