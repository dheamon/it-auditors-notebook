import Link from 'next/link'
import { Linkedin } from 'lucide-react'
import { siteConfig } from '@/lib/config'

const footerCategories = [
  { name: 'IT Audit', href: '/categories/it-audit' },
  { name: 'SOC Reports', href: '/categories/soc-reports' },
  { name: 'Cybersecurity', href: '/categories/cybersecurity' },
  { name: 'Technology Risk', href: '/categories/technology-risk' },
  { name: 'AI Governance', href: '/categories/ai-governance' },
  { name: 'Forensics', href: '/categories/forensics' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="text-gray-300" style={{ background: '#2D3748' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-2">{siteConfig.siteName}</h3>
            <p className="text-sm text-gray-400 mb-4">{siteConfig.tagline}</p>
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Categories</h4>
            <ul className="space-y-2">
              {footerCategories.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Articles', href: '/articles' },
                { label: 'All Categories', href: '/categories' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Login', href: '/dashboard' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">About</h4>
            <p className="text-sm text-gray-400">
              Practical insights on IT Audit, SOC reporting, cybersecurity governance, technology risk, forensic
              investigations, and AI governance for audit and risk professionals.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {year} {siteConfig.siteName}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built for IT Audit and Technology Risk professionals.
          </p>
        </div>
      </div>
    </footer>
  )
}
