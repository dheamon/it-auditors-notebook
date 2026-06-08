import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/lib/config'

// ── Expose — display / heading font ────────────────────────────────────────
// Variable font covers all weights (100–900) in a single file.
// Use font-weight to select: 400 Regular, 500 Medium, 700 Bold, 900 Black
const expose = localFont({
  src: [
    { path: '../public/fonts/Expose-Variable.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-expose',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

// ── Bespoke Sans — body / UI font ───────────────────────────────────────────
// Variable fonts cover all weights (100–900) in two files (normal + italic).
// Use font-weight to select: 300 Light, 400 Regular, 500 Medium, 700 Bold, 800 Extrabold
const bespokeSans = localFont({
  src: [
    { path: '../public/fonts/BespokeSans-Variable.woff2',       weight: '100 900', style: 'normal' },
    { path: '../public/fonts/BespokeSans-VariableItalic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-bespoke-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.siteName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    'Practical articles on IT audit, SOC reporting, cybersecurity governance, technology risk, forensic investigations, and AI governance for audit and risk professionals.',
  keywords: ['IT audit', 'SOC reports', 'cybersecurity', 'technology risk', 'internal audit', 'AI governance', 'forensics'],
  authors: [{ name: siteConfig.siteName }],
  openGraph: {
    type: 'website',
    siteName: siteConfig.siteName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${expose.variable} ${bespokeSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F7FAFC]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
