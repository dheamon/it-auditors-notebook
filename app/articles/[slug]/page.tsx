import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
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
      title,
      description,
      url,
      type: 'article',
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

  const readingTime = estimateReadingTime(article.content || [])
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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link href="/articles" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent-DEFAULT mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Category */}
        {article.category && (
          <div className="mb-4">
            <CategoryBadge name={article.category.name} slug={article.category.slug?.current} />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-DEFAULT leading-tight mb-5">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(article.publishedDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {readingTime} min read
          </span>
          {article.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {article.author.name}
            </span>
          )}
        </div>

        {/* Featured image */}
        {article.featuredImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-md">
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

        {/* Content */}
        {article.content && (
          <div className="prose prose-lg max-w-none">
            <PortableText value={article.content} components={portableTextComponents} />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <ShareButtons title={article.title} url={articleUrl} />
        </div>

        {/* Author bio */}
        {article.author && (
          <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {article.author.name[0]}
            </div>
            <div>
              <p className="font-semibold text-primary-DEFAULT mb-1">{article.author.name}</p>
              {article.author.bio && <p className="text-sm text-gray-600">{article.author.bio}</p>}
              {article.author.linkedinUrl && (
                <a href={article.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-DEFAULT hover:underline mt-1 inline-block">
                  LinkedIn Profile →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12">
          <NewsletterSignup variant="inline" />
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-primary-DEFAULT mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
