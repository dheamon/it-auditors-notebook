import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  siteName: "The IT Auditor's Notebook",
  tagline: 'Technology, Risk & Audit Insights',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://it-auditors-notebook.vercel.app',
  linkedinUrl: 'https://www.linkedin.com',
}

export const CATEGORIES = [
  { name: 'IT Audit', slug: 'it-audit', description: 'IT audit methodologies, frameworks, and best practices.' },
  { name: 'SOC Reports', slug: 'soc-reports', description: 'SOC 1, SOC 2, and SOC 3 reporting insights and guidance.' },
  { name: 'Internal Audit', slug: 'internal-audit', description: 'Internal audit strategies, tools, and techniques.' },
  { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Cybersecurity governance, controls, and risk management.' },
  { name: 'Technology Risk', slug: 'technology-risk', description: 'Emerging technology risks and mitigation strategies.' },
  { name: 'Forensics', slug: 'forensics', description: 'Digital forensics, investigations, and fraud examination.' },
  { name: 'AI Governance', slug: 'ai-governance', description: 'AI risk, governance frameworks, and audit considerations.' },
  { name: 'Data Analytics', slug: 'data-analytics', description: 'Data analytics in audit, continuous monitoring, and reporting.' },
]
