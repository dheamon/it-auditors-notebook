import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeClient } from '@/lib/write-client'

function unauth() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

/** GET /api/dashboard/drafts — list all drafts */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  try {
    const drafts = await writeClient.fetch(
      `*[_type == "draftArticle"] | order(updatedAt desc) {
        _id, title, slug, status, category, tags,
        createdAt, updatedAt, wordCount, excerpt
      }`
    )
    return NextResponse.json(drafts)
  } catch (err) {
    console.error('[drafts GET]', err)
    return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 })
  }
}

/** POST /api/dashboard/drafts — create new draft */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  try {
    const body = await request.json()
    const now = new Date().toISOString()

    const rawTitle: string = body.title || 'Untitled Draft'
    const slug = rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 96) + `-${Date.now()}`

    const draft = await writeClient.create({
      _type: 'draftArticle',
      title: rawTitle,
      slug: { _type: 'slug', current: slug },
      excerpt: body.excerpt || '',
      content: body.content || '',
      status: 'draft',
      category: body.category || '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      wordCount: body.wordCount ?? 0,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(draft, { status: 201 })
  } catch (err) {
    console.error('[drafts POST]', err)
    return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 })
  }
}
