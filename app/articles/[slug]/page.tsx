import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { marked } from 'marked'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/queries'
import { formatDate, estimateReadingTime, absoluteUrl } from '@/lib/utils'
import { urlForImage } from '@/lib/sanity'
import { portableTextComponents } from '@/components/ui/PortableTextComponents'
import CategoryBadge from '@/components/ui/CategoryBadge'
import ShareButtons from '@/components/ui/ShareButtons'
import ArticleCard from '@/components/ui/ArticleCard'
import NewsletterSignup from '@/components/ui/NewsletterSignup'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs().catch(() => [])
  return slugs.map(({ slug }) => ({ slug: slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug).catch(() => null)
  if (!article) return { title: 'Article Not Found' }

  const imageUrl = article.featuredImage ? urlForImage(article.featuredImage, 1200, 630) : undefined
  const title = article.seoTitle || article.title
  const description = article.seoDescription || article.excerpt || ''
  const url = absoluteUrl(`/articles/${slug}`)

  return {
    title,
    description,
    openGraph: {
      title, description, url, type: 'article',
      publishedTime: article.publishedDate,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: article.title }] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: imageUrl ? [imageUrl] : [] },
    alternates: { canonical: url },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug).catch(() => null)
  if (!article) notFound()

  // Support both PortableText and markdown content
  const readingTime = article.markdownContent
    ? Math.max(1, Math.ceil(article.markdownContent.split(/\s+/).filter(Boolean).length / 200))
    : estimateReadingTime(article.content || [])

  const markdownHtml = article.markdownContent
    ? await marked(article.markdownContent, { breaks: true, gfm: true })
    : null
  const imageUrl = urlForImage(article.featuredImage, 1200, 630)
  const articleUrl = absoluteUrl(`/articles/${slug}`)

  const relatedArticles = article.category
    ? await getRelatedArticles(article._id, article.category._id).catch(() => [])
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: imageUrl,
    datePublished: article.publishedDate,
    author: { '@type': 'Person', name: article.author?.name || siteConfig.siteName },
    publisher: { '@type': 'Organization', name: siteConfig.siteName },
    url: articleUrl,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* Back link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Category */}
        {article.category && (
          <div className="mb-4">
            <CategoryBadge name={article.category.name} slug={article.category.slug?.current} />
          </div>
        )}

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
          style={{ color: '#1A365D' }}
        >
          {article.title}
        </h1>

        {/* Meta row — wraps naturally on mobile */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            {formatDate(article.publishedDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 flex-shrink-0" />
            {readingTime} min read
          </span>
          {article.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 flex-shrink-0" />
              {article.author.name}
            </span>
          )}
        </div>

        {/* Featured image */}
        {article.featuredImage && (
          <div className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-8 md:mb-10 shadow-md">
            <Image
              src={imageUrl}
              alt={article.featuredImage.alt || article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* Article body — markdown (published from dashboard) */}
        {markdownHtml && (
          <div
            className="md-content"
            dangerouslySetInnerHTML={{ __html: markdownHtml }}
          />
        )}

        {/* Article body — PortableText (authored in Sanity Studio) */}
        {!markdownHtml && article.content && (
          <div className="prose prose-base md:prose-lg max-w-none">
            <PortableText value={article.content} components={portableTextComponents} />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 md:mt-10 pt-6 border-t border-gray-100">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100">
          <ShareButtons title={article.title} url={articleUrl} />
        </div>

        {/* Author bio — stacks on mobile */}
        {article.author && (
          <div className="mt-8 md:mt-10 p-5 md:p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-start">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ background: '#1A365D' }}
            >
              {article.author.name[0]}
            </div>
            <div className="min-w-0">
              <p className="font-semibold mb-1" style={{ color: '#1A365D' }}>{article.author.name}</p>
              {article.author.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">{article.author.bio}</p>
              )}
              {article.author.linkedinUrl && (
                <a
                  href={article.author.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline mt-1 inline-block"
                  style={{ color: '#6366F1' }}
                >
                  LinkedIn Profile →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-10 md:mt-12">
          <NewsletterSignup variant="inline" />
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#1A365D' }}>Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedArticles.map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
