import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeClient } from '@/lib/write-client'

function unauth() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

type RouteContext = { params: Promise<{ id: string }> }

/** GET /api/dashboard/drafts/[id] */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { id } = await params

  try {
    const draft = await writeClient.fetch(
      `*[_type == "draftArticle" && _id == $id][0]`,
      { id }
    )
    if (!draft) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(draft)
  } catch (err) {
    console.error('[draft GET]', err)
    return NextResponse.json({ error: 'Failed to fetch draft' }, { status: 500 })
  }
}

/** PUT /api/dashboard/drafts/[id] */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { id } = await params

  try {
    const body = await request.json()
    const now = new Date().toISOString()

    const patch: Record<string, unknown> = {
      updatedAt: now,
    }

    if (body.title !== undefined) patch.title = body.title
    if (body.excerpt !== undefined) patch.excerpt = body.excerpt
    if (body.content !== undefined) patch.content = body.content
    if (body.category !== undefined) patch.category = body.category
    if (body.tags !== undefined) patch.tags = Array.isArray(body.tags) ? body.tags : []
    if (body.wordCount !== undefined) patch.wordCount = body.wordCount
    if (body.status !== undefined) patch.status = body.status
    if (body.slug !== undefined) patch.slug = { _type: 'slug', current: body.slug }

    const updated = await writeClient.patch(id).set(patch).commit()
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[draft PUT]', err)
    return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 })
  }
}

/** DELETE /api/dashboard/drafts/[id] */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  const { id } = await params

  try {
    await writeClient.delete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[draft DELETE]', err)
    return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
  }
}
