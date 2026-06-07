# The IT Auditor's Notebook — Codebase Architecture

## Project
Next.js 16 (App Router, Turbopack) + TypeScript blog for IT audit and technology
risk professionals. Deployed on Vercel. Content managed via Sanity CMS v3.
Live at: https://it-auditors-notebook.vercel.app
GitHub: https://github.com/dheamon/it-auditors-notebook
Sanity project ID: zdoqt5st, dataset: production

## Stack
- Framework: Next.js 16.2.7, App Router, React 19, TypeScript strict mode
- Styling: Tailwind CSS v3 — IMPORTANT: custom color classes (bg-primary-DEFAULT,
  text-accent-DEFAULT, etc.) do NOT generate via JIT. Use inline style={{ }} with
  hardcoded hex values instead. Brand colors: primary #1A365D, secondary #2D3748,
  accent #6366F1, background #F7FAFC, text #1A202C
- CMS: Sanity v3 with @sanity/client, @portabletext/react for rich text rendering
- Images: @sanity/image-url + Next.js <Image> with remotePatterns for cdn.sanity.io
- Icons: lucide-react
- Utilities: date-fns (date formatting), clsx (className merging)
- Install: always use --legacy-peer-deps (peer dep conflict between packages)
- Components with onMouseEnter/onMouseLeave MUST be marked 'use client'. Pages
  with both export const metadata and event handlers must split into a server
  page component + a separate 'use client' child component.

## Folder Structure
/app                      Next.js App Router pages
  /page.tsx               Homepage (server component, revalidate 3600)
  /layout.tsx             Root layout — Inter font, Header + Footer
  /not-found.tsx          404 page
  /sitemap.ts             Dynamic XML sitemap
  /robots.ts              robots.txt
  /globals.css            Tailwind directives + Google Fonts import + focus style
  /articles/
    page.tsx              All articles list
    [slug]/page.tsx       Article detail — PortableText body, author bio,
                          share buttons, related articles, newsletter CTA
  /categories/
    page.tsx              Categories index (server) + CategoriesPageGrid.tsx (client)
    CategoriesPageGrid.tsx  'use client' grid with hover handlers
    [slug]/page.tsx       Articles filtered by category
  /about/page.tsx         About blog + author + expertise grid
  /contact/
    page.tsx              Contact page shell
    ContactForm.tsx       'use client' form with fetch to /api/contact
  /search/
    page.tsx              Search shell + Suspense wrapper
    SearchResults.tsx     Server component — fetches Sanity search results
  /studio/[[...tool]]/
    page.tsx              Embedded Sanity Studio ('use client', NextStudio)
  /api/
    subscribe/route.ts    POST — saves email to Sanity subscriber doc
    contact/route.ts      POST — logs to console (placeholder for Resend)

/components
  /layout/
    Header.tsx            'use client' — sticky nav, mobile hamburger menu,
                          active route highlighting, all colors via inline style
    Footer.tsx            Server component — inline style for bg (#2D3748)
  /home/
    Hero.tsx              Server component — gradient via inline style
    HeroButtons.tsx       'use client' — CTA buttons with hover handlers
    FeaturedArticles.tsx  Server component — top 3 featured articles
    LatestArticles.tsx    Server component — latest 6 articles grid
    CategoriesGrid.tsx    'use client' — 8 category cards with hover handlers
  /ui/
    ArticleCard.tsx       Card for article lists — featured (horizontal) and
                          standard (vertical) variants; image wrapped in <Link>
    CategoryBadge.tsx     'use client' — indigo pill badge with hover
    NewsletterSignup.tsx  'use client' — inline and banner variants,
                          POSTs to /api/subscribe
    SearchBar.tsx         'use client' — controlled input, pushes to /search?q=
    ShareButtons.tsx      'use client' — LinkedIn, Twitter, copy-link;
                          icon-only on mobile, label on sm+
    PortableTextComponents.tsx  Portable text renderer — custom block/mark/type
                          components for h2-h4, blockquote, links, images, callouts

/lib
  sanity.ts         createClient (useCdn: true in prod), imageUrlBuilder,
                    urlForImage(source, width, height) → string
  queries.ts        All GROQ queries — getFeaturedArticles, getLatestArticles,
                    getAllArticles, getArticleBySlug, getArticlesByCategory,
                    getRelatedArticles, getAllCategories, getCategoryBySlug,
                    getAuthor, searchArticles, getArticleSlugs, getCategorySlugs
  utils.ts          formatDate, formatDateShort, estimateReadingTime,
                    truncateText, slugify, absoluteUrl
  config.ts         siteConfig object (siteName, tagline, siteUrl, linkedinUrl)
                    + CATEGORIES array (8 categories with name/slug/description)

/sanity
  sanity.config.ts  Sanity Studio config — structureTool with custom structure
  /schemas/
    author.ts       name, bio, profilePicture (image), linkedinUrl
    category.ts     name, description, slug
    article.ts      title, slug, excerpt, featuredImage (with alt), content
                    (block array with callout + image types), author (ref),
                    category (ref), tags (string[]), publishedDate, featured
                    (bool), seoTitle, seoDescription — has SEO group tab
    subscriber.ts   email, name, subscribedAt
    index.ts        exports schemaTypes array

/types/index.ts     TypeScript interfaces: Article, Author, Category,
                    SanityImage, PortableTextBlock, Subscriber, SearchResult

/scripts/seed.ts    Standalone seed script — creates 8 categories, 1 author,
                    5 full sample articles. Run: npx tsx scripts/seed.ts
                    Reads .env.local manually (no dotenv dependency)

## Private Author Dashboard (Phase 1 — added)

Routes (all protected by proxy.ts, redirects to /login):
  /login                           Credentials login (NextAuth)
  /dashboard                       Home — stats + recent drafts
  /dashboard/articles              List with search, sort, duplicate, delete
  /dashboard/articles/new          Create draft → redirect to editor
  /dashboard/articles/[id]         Full-screen markdown editor with autosave

Key files:
  proxy.ts                         Route protection (Next.js 16 renamed middleware→proxy)
  lib/auth.ts                      NextAuth authOptions (JWT, 30d, CredentialsProvider)
  lib/write-client.ts              Sanity write client (useCdn:false, token auth)
  lib/draft-queries.ts             getDrafts/getDraftById/getDraftStats
  lib/validation.ts                100% local validation engine (NO AI)
  scripts/generate-hash.ts         bcrypt hash generator
  sanity/schemas/draftArticle.ts   Draft schema (title,slug,content,status,category,tags,wordCount)
  components/dashboard/DashboardSidebar.tsx  'use client', desktop sidebar + mobile drawer
  app/login/LoginForm.tsx          'use client', signIn from next-auth/react
  app/dashboard/layout.tsx         Server, checks getServerSession, renders sidebar
  app/dashboard/articles/ArticlesClient.tsx   'use client', search/sort/delete/duplicate
  app/dashboard/articles/new/NewArticleForm.tsx  'use client', POST to /api/dashboard/drafts
  app/dashboard/articles/[id]/EditorClient.tsx   'use client', MDEditor dynamic import

Auth env vars (add to .env.local AND Vercel dashboard):
  NEXTAUTH_SECRET=<openssl rand -base64 32>
  NEXTAUTH_URL=https://it-auditors-notebook.vercel.app  (production) / http://localhost:3000 (dev)
  ADMIN_EMAIL=your@email.com
  ADMIN_PASSWORD_HASH=<npx tsx scripts/generate-hash.ts YourPassword>

Editor features:
  - @uiw/react-md-editor — dynamic import (ssr:false), live split preview
  - Autosave every 15s (debounced) + manual Save button
  - Word count + reading time (live, in-memory from content)
  - Save status: Saved ✓ / Saving… / Unsaved changes / Failed
  - Left panel tabs: Metadata (title/category/tags/excerpt) | Validate
  - Validation — all local (readability/structure/SEO/writing, score 0–100)

## Environment Variables (.env.local)
NEXT_PUBLIC_SANITY_PROJECT_ID=zdoqt5st
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=<editor token>        # used by /api/subscribe to write docs
NEXT_PUBLIC_SITE_URL=https://it-auditors-notebook.vercel.app

## Data Flow
1. Content authored in Sanity Studio (/studio) or via seed script
2. Sanity stores docs in cloud (projectId zdoqt5st)
3. Server components fetch via GROQ queries in lib/queries.ts
4. Pages use revalidate = 3600 (ISR — rebuild every hour)
5. Static params pre-generated for /articles/[slug] and /categories/[slug]
6. Images served via Sanity CDN (cdn.sanity.io), optimized by Next.js Image

## Key Patterns
- Server components fetch data directly (no useEffect/SWR/React Query)
- 'use client' only for interactivity: forms, hover handlers, mobile menu, search
- All colors via inline style={{ color: '#hex' }} — never Tailwind custom color
  classes — because JIT won't generate them for non-standard color names
- SEO: generateMetadata per page, JSON-LD on article pages, OG + Twitter cards
- No prose plugin — custom PortableText components handle all article typography
- Article images: always wrapped in <Link> so clicking navigates to article
- Mobile: flex-col default → sm:flex-row for multi-column layouts; all grids
  use grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pattern
- Contact form: placeholder only (logs to console), ready for Resend integration
- Newsletter: stores in Sanity, ready for Mailchimp/ConvertKit via /api/subscribe

## Deployment
- Vercel project: sree-d-s-projects/it-auditors-notebook
- vercel.json sets framework:nextjs, installCommand uses --legacy-peer-deps
- .npmrc sets legacy-peer-deps=true for all npm installs
- GitHub Actions CI in .github/workflows/ci.yml (type-check + lint + build)
- Push to main → manual deploy with: npx vercel --prod
  (auto-deploy via Vercel Git integration not yet connected)
