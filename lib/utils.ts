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

/**
 * Converts Sanity PortableText blocks to a Markdown string.
 * Used to pre-populate the dashboard editor when an article was
 * originally authored in Sanity Studio (block content, no markdownContent).
 */
export function portableTextToMarkdown(blocks: Array<{
  _type: string
  style?: string
  listItem?: string
  level?: number
  children?: Array<{ _type?: string; marks?: string[]; text?: string }>
  markDefs?: Array<{ _key: string; _type: string; href?: string }>
}>): string {
  const lines: string[] = []

  for (const block of blocks) {
    if (block._type !== 'block') continue   // skip images, callouts etc.

    // Build inline text with marks applied
    const inline = (block.children ?? []).map(child => {
      let t = child.text ?? ''
      if (!t) return ''
      const marks = child.marks ?? []

      // Resolve link mark first (wraps the text)
      const linkMark = marks.find(m =>
        block.markDefs?.some(def => def._key === m && def._type === 'link')
      )
      if (linkMark) {
        const def = block.markDefs?.find(d => d._key === linkMark)
        if (def?.href) t = `[${t}](${def.href})`
      }

      // Inline formatting (code before bold/italic to avoid double-wrapping)
      if (marks.includes('code')) {
        t = `\`${t}\``
      } else {
        if (marks.includes('strong')) t = `**${t}**`
        if (marks.includes('em'))     t = `*${t}*`
      }

      return t
    }).join('')

    if (!inline.trim()) continue

    // Block-level style
    let line: string
    if (block.listItem === 'bullet') {
      line = `- ${inline}`
    } else if (block.listItem === 'number') {
      line = `1. ${inline}`
    } else {
      switch (block.style) {
        case 'h1':         line = `# ${inline}`;    break
        case 'h2':         line = `## ${inline}`;   break
        case 'h3':         line = `### ${inline}`;  break
        case 'h4':         line = `#### ${inline}`; break
        case 'blockquote': line = `> ${inline}`;    break
        default:           line = inline
      }
    }

    lines.push(line)
  }

  return lines.join('\n\n')
}

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://it-auditors-notebook.vercel.app'
  return `${baseUrl}${path}`
}
