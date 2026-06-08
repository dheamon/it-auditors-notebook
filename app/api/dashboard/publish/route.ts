import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { writeClient } from '@/lib/write-client'

function unauth() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

/**
 * POST /api/dashboard/publish
 * Converts a draftArticle into a live article document in Sanity.
 * Body: { draftId: string }
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return unauth()

  try {
    const { draftId } = await request.json()
    if (!draftId) {
      return NextResponse.json({ error: 'draftId is required' }, { status: 400 })
    }

    // Fetch the draft
    const draft = await writeClient.fetch(
      `*[_type == "draftArticle" && _id == $id][0]`,
      { id: draftId }
    )
    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    // Fetch the first author
    const author = await writeClient.fetch(
      `*[_type == "author"][0] { _id }`
    )

    // Find matching category by name
    const category = draft.category
      ? await writeClient.fetch(
          `*[_type == "category" && name == $name][0] { _id }`,
          { name: draft.category }
        )
      : null

    // Build a URL-safe slug (append timestamp for uniqueness)
    const baseSlug = (draft.title as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80)

    // Check if slug already exists; append suffix if needed
    const existingSlug = await writeClient.fetch(
      `*[_type == "article" && slug.current == $slug][0]._id`,
      { slug: baseSlug }
    )
    const finalSlug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug

    const now = new Date().toISOString()

    // Create the article document
    const articleData: { _type: string; [key: string]: unknown } = {
      _type: 'article',
      title: draft.title || 'Untitled',
      slug: { _type: 'slug', current: finalSlug },
      excerpt: draft.excerpt || '',
      markdownContent: draft.content || '',
      tags: draft.tags || [],
      publishedDate: now,
      featured: false,
      seoTitle: (draft.title as string)?.slice(0, 60) || '',
      seoDescription: (draft.excerpt as string)?.slice(0, 160) || '',
    }

    if (author?._id) {
      articleData.author = { _type: 'reference', _ref: author._id }
    }
    if (category?._id) {
      articleData.category = { _type: 'reference', _ref: category._id }
    }

    const article = await writeClient.create(articleData)

    // Mark the draft as published
    await writeClient
      .patch(draftId)
      .set({ status: 'published', updatedAt: now })
      .commit()

    // Bust ISR cache so the article is immediately visible on the live blog
    revalidatePath(`/articles/${finalSlug}`)
    revalidatePath('/articles')
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      articleId: article._id,
      slug: finalSlug,
    })
  } catch (err) {
    console.error('[publish POST]', err)
    return NextResponse.json({ error: 'Failed to publish article' }, { status: 500 })
  }
}
