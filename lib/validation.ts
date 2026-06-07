/**
 * Local deterministic article validation engine.
 * Zero external APIs. Zero AI. Pure text analysis.
 */

export type ValidationStatus = 'good' | 'warning' | 'needs-attention'

export interface ValidationCheck {
  name: string
  status: ValidationStatus
  value: string
  message: string
  tip?: string
}

export interface ValidationReport {
  readability: ValidationCheck[]
  structure: ValidationCheck[]
  seo: ValidationCheck[]
  writing: ValidationCheck[]
  score: number // 0–100
}

// Common words to exclude from repetition analysis
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'will',
  'they', 'their', 'been', 'were', 'which', 'when', 'what', 'also', 'more',
  'than', 'your', 'into', 'about', 'these', 'some', 'such', 'there', 'other',
  'then', 'each', 'over', 'after', 'where', 'through', 'those', 'both',
  'between', 'during', 'before', 'under', 'should', 'would', 'could', 'might',
  'must', 'shall', 'upon', 'every', 'while',
])

const TRANSITION_WORDS = [
  'however', 'therefore', 'furthermore', 'additionally', 'consequently',
  'nevertheless', 'moreover', 'although', 'because', 'since', 'while',
  'whereas', 'thus', 'hence', 'accordingly', 'finally', 'firstly', 'secondly',
  'lastly', 'specifically', 'notably', 'importantly', 'overall', 'similarly',
  'conversely', 'meanwhile', 'subsequently', 'alternatively',
]

/** Strip markdown syntax to get readable plain text. */
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')        // code blocks
    .replace(/`[^`]+`/g, '')               // inline code
    .replace(/^#{1,6}\s+/gm, '')           // headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')    // bold
    .replace(/\*([^*]+)\*/g, '$1')         // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // images
    .replace(/^[-*+]\s/gm, '')             // list items
    .replace(/^\d+\.\s/gm, '')             // ordered list
    .replace(/^>\s/gm, '')                 // blockquotes
    .replace(/[-]{3,}/g, '')               // horizontal rules
    .trim()
}

export function validateArticle(
  content: string,
  title: string,
  excerpt: string
): ValidationReport {
  const readability: ValidationCheck[] = []
  const structure: ValidationCheck[] = []
  const seo: ValidationCheck[] = []
  const writing: ValidationCheck[] = []

  const plain = stripMarkdown(content)

  // Token arrays
  const words = plain.split(/\s+/).filter(w => w.trim().length > 0)
  const sentences = plain
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5)
  const paragraphs = content.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0)
  const headings = (content.match(/^#{1,6}\s.+/gm) || [])

  // ─────────────────────────────────────────────────────────────
  // READABILITY
  // ─────────────────────────────────────────────────────────────

  const avgSentenceLen = sentences.length > 0
    ? Math.round(words.length / sentences.length)
    : 0

  readability.push({
    name: 'Average Sentence Length',
    status:
      avgSentenceLen === 0
        ? 'needs-attention'
        : avgSentenceLen <= 20
        ? 'good'
        : avgSentenceLen <= 30
        ? 'warning'
        : 'needs-attention',
    value: `${avgSentenceLen} words`,
    message:
      avgSentenceLen === 0
        ? 'No content yet'
        : avgSentenceLen <= 20
        ? 'Sentences are clear and readable'
        : avgSentenceLen <= 30
        ? 'Some sentences may be complex'
        : 'Sentences are too long for easy reading',
    tip: 'Aim for 15–20 words per sentence for maximum clarity.',
  })

  const longSentences = sentences.filter(s => s.split(/\s+/).length > 30).length
  readability.push({
    name: 'Long Sentences',
    status: longSentences === 0 ? 'good' : longSentences <= 3 ? 'warning' : 'needs-attention',
    value: longSentences === 0 ? 'None' : `${longSentences} found`,
    message:
      longSentences === 0
        ? 'No sentences exceed 30 words'
        : `${longSentences} sentence${longSentences > 1 ? 's' : ''} exceed 30 words`,
    tip: 'Break long sentences into two shorter, clearer ones.',
  })

  const avgParaLen =
    paragraphs.length > 0
      ? Math.round(words.length / paragraphs.length)
      : 0
  readability.push({
    name: 'Average Paragraph Length',
    status:
      avgParaLen === 0
        ? 'needs-attention'
        : avgParaLen <= 80
        ? 'good'
        : avgParaLen <= 120
        ? 'warning'
        : 'needs-attention',
    value: `${avgParaLen} words`,
    message:
      avgParaLen <= 80
        ? 'Paragraphs are well-sized'
        : avgParaLen <= 120
        ? 'Some paragraphs are long'
        : 'Paragraphs are too dense',
    tip: 'Keep paragraphs to 3–5 sentences for readability.',
  })

  // ─────────────────────────────────────────────────────────────
  // STRUCTURE
  // ─────────────────────────────────────────────────────────────

  structure.push({
    name: 'Title',
    status: !title.trim()
      ? 'needs-attention'
      : title.length <= 70
      ? 'good'
      : 'warning',
    value: title.trim() ? `${title.length} characters` : 'Missing',
    message: !title.trim()
      ? 'Article has no title'
      : title.length <= 70
      ? 'Title length is good'
      : 'Title may be truncated in search results',
    tip: 'Keep the title under 60 characters for best SEO display.',
  })

  structure.push({
    name: 'Headings',
    status:
      headings.length === 0
        ? 'needs-attention'
        : headings.length >= 3
        ? 'good'
        : 'warning',
    value: `${headings.length} heading${headings.length !== 1 ? 's' : ''}`,
    message:
      headings.length === 0
        ? 'No headings found — structure is unclear'
        : headings.length >= 3
        ? 'Good heading structure'
        : 'Consider adding more section headings',
    tip: 'Use ## and ### headings to break content into scannable sections.',
  })

  structure.push({
    name: 'Paragraph Count',
    status:
      paragraphs.length < 3
        ? 'needs-attention'
        : paragraphs.length >= 6
        ? 'good'
        : 'warning',
    value: `${paragraphs.length} paragraph${paragraphs.length !== 1 ? 's' : ''}`,
    message:
      paragraphs.length < 3
        ? 'Very short — add more content'
        : paragraphs.length >= 6
        ? 'Well-developed article'
        : 'Could be expanded further',
    tip: 'Most full-length articles have 8–15+ paragraphs.',
  })

  const introWords = paragraphs.length > 0
    ? paragraphs[0].split(/\s+/).length
    : 0
  structure.push({
    name: 'Introduction',
    status: introWords >= 50 ? 'good' : introWords >= 25 ? 'warning' : 'needs-attention',
    value: introWords > 0 ? `${introWords} words` : 'Missing',
    message:
      introWords >= 50
        ? 'Strong opening paragraph'
        : introWords >= 25
        ? 'Opening paragraph is short'
        : 'First paragraph is very brief or missing',
    tip: 'Open with a paragraph that sets context and engages the reader immediately.',
  })

  const conclusionWords =
    paragraphs.length >= 2
      ? paragraphs[paragraphs.length - 1].split(/\s+/).length
      : 0
  structure.push({
    name: 'Conclusion',
    status:
      conclusionWords >= 40
        ? 'good'
        : conclusionWords >= 20
        ? 'warning'
        : 'needs-attention',
    value: conclusionWords > 0 ? `${conclusionWords} words` : 'Missing',
    message:
      conclusionWords >= 40
        ? 'Article has a solid closing'
        : conclusionWords >= 20
        ? 'Closing is brief'
        : 'Article lacks a clear conclusion',
    tip: 'End with a summary, key takeaways, or a call to action.',
  })

  // ─────────────────────────────────────────────────────────────
  // SEO
  // ─────────────────────────────────────────────────────────────

  seo.push({
    name: 'Word Count',
    status:
      words.length < 300
        ? 'needs-attention'
        : words.length < 600
        ? 'warning'
        : words.length >= 1000
        ? 'good'
        : 'warning',
    value: `${words.length.toLocaleString()} words`,
    message:
      words.length < 300
        ? 'Too short — target at least 600 words'
        : words.length < 600
        ? 'Acceptable length, but 1,000+ is better for SEO'
        : words.length >= 1000
        ? 'Excellent article length for SEO'
        : 'Good length — aim for 1,000+ for competitive topics',
    tip: 'Long-form content (1,000–2,000 words) tends to rank and share better.',
  })

  const metaLen = excerpt.trim().length
  seo.push({
    name: 'Meta Description',
    status:
      metaLen === 0
        ? 'needs-attention'
        : metaLen < 120
        ? 'warning'
        : metaLen <= 160
        ? 'good'
        : 'warning',
    value: metaLen > 0 ? `${metaLen} characters` : 'Missing',
    message:
      metaLen === 0
        ? 'No excerpt/meta description added'
        : metaLen < 120
        ? 'Description is too short'
        : metaLen <= 160
        ? 'Good meta description length'
        : 'May be truncated in search results',
    tip: 'Write a compelling 120–160 character description for search snippets.',
  })

  seo.push({
    name: 'Heading Count',
    status:
      headings.length === 0
        ? 'needs-attention'
        : headings.length >= 4
        ? 'good'
        : 'warning',
    value: `${headings.length}`,
    message:
      headings.length === 0
        ? 'No headings — hurts both SEO and readability'
        : headings.length >= 4
        ? 'Good heading distribution'
        : 'Add more H2/H3 subheadings',
    tip: 'Include target keywords naturally in your headings.',
  })

  // Title keyword presence in body
  if (title.trim()) {
    const titleTokens = title
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 4 && !STOP_WORDS.has(w))
    if (titleTokens.length > 0) {
      const bodyLower = plain.toLowerCase()
      const found = titleTokens.filter(w => bodyLower.includes(w)).length
      const ratio = found / titleTokens.length
      seo.push({
        name: 'Title Keywords in Body',
        status: ratio >= 0.7 ? 'good' : ratio >= 0.4 ? 'warning' : 'needs-attention',
        value: `${Math.round(ratio * 100)}% present`,
        message:
          ratio >= 0.7
            ? 'Title keywords appear throughout the body'
            : ratio >= 0.4
            ? 'Some title keywords found in body'
            : 'Title keywords are largely absent from body',
        tip: 'Naturally mention your title keywords 2–4 times in the article.',
      })
    }
  }

  // ─────────────────────────────────────────────────────────────
  // WRITING HEALTH
  // ─────────────────────────────────────────────────────────────

  // Passive voice heuristic (is/are/was/were + past participle)
  const passivePattern = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi
  const passiveMatches = plain.match(passivePattern) || []
  const passivePct =
    sentences.length > 0
      ? Math.round((passiveMatches.length / sentences.length) * 100)
      : 0

  writing.push({
    name: 'Passive Voice',
    status: passivePct <= 10 ? 'good' : passivePct <= 25 ? 'warning' : 'needs-attention',
    value: `~${passivePct}%`,
    message:
      passivePct <= 10
        ? 'Strong active voice throughout'
        : passivePct <= 25
        ? 'Some passive voice — review highlighted areas'
        : 'High passive voice usage detected',
    tip: 'Prefer active voice: "The auditor found…" over "It was found that…".',
  })

  // Overused content words
  const freq: Record<string, number> = {}
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '')
    if (clean.length > 4 && !STOP_WORDS.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1
    }
  })
  const threshold = words.length > 0 ? Math.max(5, words.length * 0.025) : 5
  const overused = Object.entries(freq)
    .filter(([, count]) => count > threshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([word, count]) => `"${word}" ×${count}`)

  writing.push({
    name: 'Overused Words',
    status: overused.length === 0 ? 'good' : overused.length <= 2 ? 'warning' : 'needs-attention',
    value: overused.length === 0 ? 'None' : overused.join(', '),
    message:
      overused.length === 0
        ? 'Good word variety'
        : `${overused.length} word${overused.length > 1 ? 's' : ''} used too frequently`,
    tip: 'Use synonyms or restructure to reduce repetition.',
  })

  // Transition words
  const bodyLower = plain.toLowerCase()
  const foundTransitions = TRANSITION_WORDS.filter(t => bodyLower.includes(t))
  writing.push({
    name: 'Transition Words',
    status:
      foundTransitions.length >= 4
        ? 'good'
        : foundTransitions.length >= 2
        ? 'warning'
        : 'needs-attention',
    value: `${foundTransitions.length} found`,
    message:
      foundTransitions.length >= 4
        ? 'Good use of transitions for flow'
        : foundTransitions.length >= 2
        ? 'Limited transitions — consider more'
        : 'No transition words found',
    tip: 'Use "however", "therefore", "furthermore" to connect ideas clearly.',
  })

  // Filler phrases
  const fillerPhrases = [
    'very ', 'really ', 'basically ', 'actually ', 'literally ',
    'in order to', 'it is important to note', 'it should be noted',
    'due to the fact that', 'in the event that', 'at this point in time',
  ]
  const fillerCount = fillerPhrases.filter(f => bodyLower.includes(f)).length
  writing.push({
    name: 'Filler Phrases',
    status: fillerCount === 0 ? 'good' : fillerCount <= 2 ? 'warning' : 'needs-attention',
    value: fillerCount === 0 ? 'None detected' : `${fillerCount} found`,
    message:
      fillerCount === 0
        ? 'Writing is concise and direct'
        : `${fillerCount} filler phrase${fillerCount > 1 ? 's' : ''} detected`,
    tip: 'Replace filler phrases with direct language. "In order to" → "to".',
  })

  // ─────────────────────────────────────────────────────────────
  // SCORE
  // ─────────────────────────────────────────────────────────────
  const all = [...readability, ...structure, ...seo, ...writing]
  const goodCount = all.filter(c => c.status === 'good').length
  const warnCount = all.filter(c => c.status === 'warning').length
  const score = all.length > 0
    ? Math.round(((goodCount + warnCount * 0.5) / all.length) * 100)
    : 0

  return { readability, structure, seo, writing, score }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

export function estimateReadTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200))
}
