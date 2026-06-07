import type { MetadataRoute } from 'next'
import { getArticleSlugs, getCategorySlugs } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import { CATEGORIES } from '@/lib/config'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${base}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  let articlePages: MetadataRoute.Sitemap = []
  try {
    const slugs = await getArticleSlugs()
    articlePages = slugs.map(({ slug }) => ({
      url: `${base}/articles/${slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))
  } catch {
    // Sitemap degrades gracefully if Sanity is unreachable
  }

  return [...staticPages, ...categoryPages, ...articlePages]
}
