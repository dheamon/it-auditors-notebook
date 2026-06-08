import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { writeClient } from '@/lib/write-client'

function unauth() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

type RouteContext = { params: Promise<{ id: string }> }

/** GET /api/dashboard/live/[id] */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { id } = await params

  try {
    const article = await writeClient.fetch(
      `*[_type == "article" && _id == $id][0] {
        _id, title, slug, excerpt, markdownContent,
        category->{_id, name},
        tags, publishedDate, seoTitle, seoDescription
      }`,
      { id }
    )
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(article)
  } catch (err) {
    console.error('[live GET]', err)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}

/**
 * PUT /api/dashboard/live/[id]
 * Updates a live article document and revalidates ISR cache.
 * Body: { title, category, tags, excerpt, markdownContent, slug }
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { id } = await params

  try {
    const body = await request.json()
    const now = new Date().toISOString()

    // Resolve category name → Sanity reference
    let categoryRef: { _type: string; _ref: string } | null = null
    if (body.category) {
      const cat = await writeClient.fetch(
        `*[_type == "category" && name == $name][0] { _id }`,
        { name: body.category }
      )
      if (cat?._id) categoryRef = { _type: 'reference', _ref: cat._id }
    }

    const patch: Record<string, unknown> = {
      updatedAt: now,
    }

    if (body.title !== undefined) {
      patch.title = body.title
      patch.seoTitle = (body.title as string).slice(0, 60)
    }
    if (body.excerpt !== undefined) {
      patch.excerpt = body.excerpt
      patch.seoDescription = (body.excerpt as string).slice(0, 160)
    }
    if (body.markdownContent !== undefined) patch.markdownContent = body.markdownContent
    if (body.tags !== undefined) patch.tags = Array.isArray(body.tags) ? body.tags : []
    if (categoryRef) patch.category = categoryRef

    const updated = await writeClient.patch(id).set(patch).commit()

    // Bust ISR cache immediately
    const slug = body.slug as string | undefined
    if (slug) revalidatePath(`/articles/${slug}`)
    revalidatePath('/articles')
    revalidatePath('/')

    return NextResponse.json({ success: true, updatedAt: now, _id: updated._id })
  } catch (err) {
    console.error('[live PUT]', err)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}
