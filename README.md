# The IT Auditor's Notebook

> Technology, Risk & Audit Insights

A professional blog for IT audit, technology risk, SOC reporting, cybersecurity governance, forensics, and AI governance professionals.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity v3
- **Hosting**: Vercel
- **Analytics**: Add Vercel Analytics or Plausible (optional)

---

## Prerequisites

- Node.js 20+
- npm 10+
- A [Sanity](https://sanity.io) account (free tier is sufficient)
- A [Vercel](https://vercel.com) account (free tier)
- A [GitHub](https://github.com) account

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/it-auditors-notebook.git
cd it-auditors-notebook
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Sanity

**Create a Sanity project:**

```bash
# Install the Sanity CLI globally if you haven't
npm install -g sanity@latest

# Log in to Sanity
sanity login

# Create a new project (follow prompts, choose "Clean project with no predefined schemas")
# Note the Project ID it gives you
```

Or go to [sanity.io/manage](https://sanity.io/manage) → New Project.

**Get your API token:**

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project → API → Tokens
3. Add a new token with **Editor** permissions (needed for the seed script and newsletter subscriptions)

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_sanity_editor_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Seed sample content (optional but recommended)

```bash
npm install -g tsx
npx tsx scripts/seed.ts
```

This creates:
- 8 categories
- 1 author
- 5 sample articles

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Access the Sanity Studio

Open [http://localhost:3000/studio](http://localhost:3000/studio) to manage content.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Sanity dataset (usually `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ✅ | Sanity API version (use `2024-01-01`) |
| `SANITY_API_TOKEN` | ✅ | Sanity token with Editor permissions |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Full URL of the site (no trailing slash) |

---

## Sanity CORS Configuration

After deploying to Vercel, add your production URL to Sanity's CORS origins:

1. [sanity.io/manage](https://sanity.io/manage) → your project → API → CORS Origins
2. Add `https://your-project.vercel.app` and enable credentials

---

## Deployment to Vercel

### Via Vercel Dashboard (recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repository
4. Add all environment variables (same as `.env.local` but with the production `NEXT_PUBLIC_SITE_URL`)
5. Deploy

### Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### GitHub Secrets for CI

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SITE_URL`

---

## Project Structure

```
/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout (Header + Footer)
│   ├── page.tsx              # Homepage
│   ├── articles/
│   │   ├── page.tsx          # All articles
│   │   └── [slug]/page.tsx   # Article detail
│   ├── categories/
│   │   ├── page.tsx          # All categories
│   │   └── [slug]/page.tsx   # Category articles
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── search/page.tsx
│   ├── studio/               # Embedded Sanity Studio
│   ├── api/
│   │   ├── subscribe/        # Newsletter subscription API
│   │   └── contact/          # Contact form API
│   ├── sitemap.ts            # Dynamic XML sitemap
│   └── robots.ts
├── components/
│   ├── layout/               # Header, Footer
│   ├── home/                 # Hero, FeaturedArticles, LatestArticles, CategoriesGrid
│   └── ui/                   # ArticleCard, CategoryBadge, SearchBar, etc.
├── lib/
│   ├── sanity.ts             # Sanity client + image URL builder
│   ├── queries.ts            # All GROQ queries
│   ├── utils.ts              # Date formatting, reading time, etc.
│   └── config.ts             # Site config, category definitions
├── sanity/
│   ├── sanity.config.ts      # Sanity Studio configuration
│   └── schemas/              # Document type schemas
├── scripts/
│   └── seed.ts               # Sample content seed script
└── types/
    └── index.ts              # TypeScript type definitions
```

---

## Adding Content

### Articles

1. Open `/studio` in your browser
2. Click **Articles** → **Create**
3. Fill in title, content, category, author, and set a published date
4. Toggle **Featured Article** to show it in the homepage featured section
5. Publish

### Newsletter Integration

The newsletter API (`/api/subscribe`) stores subscribers in Sanity. To connect an email provider:

**Mailchimp**: Use the Mailchimp API v3 in `app/api/subscribe/route.ts`
**ConvertKit**: Use the ConvertKit API
**Resend**: Add to the contact and subscribe routes

### Contact Form Email

Edit `app/api/contact/route.ts` and uncomment/add your email provider:

```typescript
// Resend example
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({ from: 'noreply@yourdomain.com', to: 'you@yourdomain.com', ... })
```

---

## Performance Notes

- All article and category pages use `revalidate = 3600` (ISR, 1-hour cache)
- Images are served via Sanity's CDN with Next.js image optimization
- Static params are pre-generated for article and category slugs
- Tailwind CSS is purged in production

---

## License

Private — all rights reserved.
