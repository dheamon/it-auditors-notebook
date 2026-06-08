export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

export interface Author {
  _id: string
  name: string
  bio?: string
  profilePicture?: SanityImage
  linkedinUrl?: string
}

export interface Category {
  _id: string
  name: string
  description?: string
  slug: { current: string }
}

export interface Article {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: SanityImage
  content?: PortableTextBlock[]
  author?: Author
  category?: Category
  tags?: string[]
  publishedDate: string
  featured?: boolean
  seoTitle?: string
  seoDescription?: string
  estimatedReadingTime?: number
  markdownContent?: string
}

export interface PortableTextBlock {
  _key: string
  _type: string
  children?: Array<{
    _key: string
    _type: string
    marks?: string[]
    text?: string
  }>
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
  }>
  style?: string
}

export interface Subscriber {
  _id: string
  email: string
  name?: string
  subscribedAt: string
}

export interface SearchResult {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: Category
  publishedDate: string
  featuredImage?: SanityImage
}

export interface NavItem {
  label: string
  href: string
}

export interface SiteConfig {
  siteName: string
  tagline: string
  siteUrl: string
  linkedinUrl: string
}

export interface DraftArticle {
  _id: string
  title: string
  slug?: { _type: 'slug'; current: string }
  excerpt?: string
  content?: string
  status: 'draft' | 'review' | 'published'
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
  wordCount?: number
}
