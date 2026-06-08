import { sanityClient } from './sanity'
import { writeClient } from './write-client'
import type { Article, Category, Author } from '@/types'

const articleFields = `
  _id,
  title,
  slug,
  excerpt,
  featuredImage,
  author->{_id, name, bio, profilePicture, linkedinUrl},
  category->{_id, name, slug, description},
  tags,
  publishedDate,
  featured,
  seoTitle,
  seoDescription
`

export async function getFeaturedArticles(): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && featured == true && defined(publishedDate)] | order(publishedDate desc)[0...3] {
      ${articleFields}
    }`
  )
}

export async function getLatestArticles(limit = 6): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && defined(publishedDate)] | order(publishedDate desc)[0...${limit}] {
      ${articleFields}
    }`
  )
}

export async function getAllArticles(): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && defined(publishedDate)] | order(publishedDate desc) {
      ${articleFields}
    }`
  )
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Use writeClient (useCdn: false) so freshly published articles are always
  // found on first request, without waiting for CDN propagation.
  return writeClient.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      ${articleFields},
      content,
      markdownContent
    }`,
    { slug }
  )
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && category->slug.current == $categorySlug && defined(publishedDate)] | order(publishedDate desc) {
      ${articleFields}
    }`,
    { categorySlug }
  )
}

export async function getRelatedArticles(articleId: string, categoryId: string, limit = 3): Promise<Article[]> {
  return sanityClient.fetch(
    `*[_type == "article" && _id != $articleId && category._ref == $categoryId && defined(publishedDate)] | order(publishedDate desc)[0...${limit}] {
      ${articleFields}
    }`,
    { articleId, categoryId }
  )
}

export async function getAllCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    `*[_type == "category"] | order(name asc) {
      _id, name, slug, description
    }`
  )
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      _id, name, slug, description
    }`,
    { slug }
  )
}

export async function getAuthor(): Promise<Author | null> {
  return sanityClient.fetch(
    `*[_type == "author"][0] {
      _id, name, bio, profilePicture, linkedinUrl
    }`
  )
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return []
  const q = `*${query}*`
  return sanityClient.fetch<Article[]>(
    `*[_type == "article" && (
      title match $q ||
      excerpt match $q ||
      $q in tags
    ) && defined(publishedDate)] | order(publishedDate desc) {
      ${articleFields}
    }`,
    { q }
  )
}

export async function getArticleSlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityClient.fetch(
    `*[_type == "article" && defined(slug.current)] { slug }`
  )
}

export async function getCategorySlugs(): Promise<{ slug: { current: string } }[]> {
  return sanityClient.fetch(
    `*[_type == "category" && defined(slug.current)] { slug }`
  )
}

export interface PublishedArticleForEdit {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  markdownContent?: string
  content?: import('@/types').PortableTextBlock[]   // block content from Studio
  category?: { _id: string; name: string }
  tags?: string[]
  publishedDate: string
  seoTitle?: string
  seoDescription?: string
}

export async function getPublishedArticleById(id: string): Promise<PublishedArticleForEdit | null> {
  return writeClient.fetch(
    `*[_type == "article" && _id == $id][0] {
      _id, title, slug, excerpt, markdownContent, content,
      category->{_id, name},
      tags, publishedDate, seoTitle, seoDescription
    }`,
    { id }
  )
}

export interface PublishedArticleSummary {
  _id: string
  title: string
  slug: { current: string }
  publishedDate: string
  category?: { name: string; slug?: { current: string } }
  tags?: string[]
}

export async function getPublishedArticlesList(): Promise<PublishedArticleSummary[]> {
  // Use writeClient (useCdn: false) so the dashboard always sees
  // freshly published articles without waiting for CDN propagation.
  return writeClient.fetch(
    `*[_type == "article" && defined(publishedDate) && defined(slug.current)] | order(publishedDate desc) {
      _id, title, slug, publishedDate,
      category->{name, slug},
      tags
    }`
  )
}

export async function addSubscriber(email: string, name?: string): Promise<void> {
  await sanityClient.create({
    _type: 'subscriber',
    email,
    name: name || '',
    subscribedAt: new Date().toISOString(),
  })
}
