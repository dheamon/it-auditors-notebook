import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/lib/config'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#F7FAFC]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
