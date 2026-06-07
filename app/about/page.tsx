import type { Metadata } from 'next'
import { Shield, FileText, BarChart2, Lock, Search, Brain } from 'lucide-react'
import { getAuthor } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'About',
  description: "Learn about The IT Auditor's Notebook — a resource for IT audit, technology risk, and governance professionals.",
}

const expertiseAreas = [
  { icon: Shield,    title: 'IT Audit',               description: 'Planning and executing IT general controls testing, application controls reviews, and IT audit methodology in accordance with ISACA and IIA standards.' },
  { icon: FileText,  title: 'SOC Reporting',           description: 'SOC 1 and SOC 2 examination experience including scoping, control selection, testing, and report writing for service organizations.' },
  { icon: BarChart2, title: 'Internal Controls',       description: 'Designing and evaluating internal control frameworks including COSO and COBIT for both technology and business process controls.' },
  { icon: Lock,      title: 'Technology Risk',         description: 'Identifying and assessing technology risks including cloud, third-party, and emerging technology risks across diverse industry environments.' },
  { icon: Search,    title: 'Forensic Investigations', description: 'Conducting digital forensic investigations, fraud risk assessments, and supporting litigation involving technology evidence.' },
  { icon: Brain,     title: 'AI Governance',           description: 'Evaluating AI and machine learning risks, building audit programs for AI systems, and assessing governance frameworks for responsible AI use.' },
]

export default async function AboutPage() {
  const author = await getAuthor().catch(() => null)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">

      {/* About the Blog */}
      <section className="mb-12 md:mb-16">
        <div className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-4"
          style={{ background: '#EEEEFF', color: '#6366F1', border: '1px solid #ABABF7' }}>
          About the Blog
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#1A365D' }}>
          The IT Auditor&apos;s Notebook
        </h1>
        <div className="space-y-4 text-gray-700 leading-relaxed max-w-none">
          <p>
            <strong>The IT Auditor&apos;s Notebook</strong> is a professional publication focused on practical
            content for IT audit, technology risk, and governance professionals. Whether you are an experienced
            auditor, a risk practitioner, or someone entering the field, this site is built to deliver actionable
            insights grounded in real-world practice.
          </p>
          <p>
            Topics covered include IT general and application controls, SOC 1 and SOC 2 reporting, internal audit
            methodology, cybersecurity governance, digital forensics, AI governance, and data analytics in audit —
            drawing on current standards from ISACA, the IIA, NIST, CISA, and the AICPA.
          </p>
          <p>
            The goal is straightforward: produce the kind of content that practitioners actually find useful —
            clear, precise, and grounded in how auditing and risk management work in practice.
          </p>
        </div>
      </section>

      {/* About the Author */}
      <section className="mb-12 md:mb-16 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
        <div className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-4"
          style={{ background: '#EEEEFF', color: '#6366F1', border: '1px solid #ABABF7' }}>
          About the Author
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
            style={{ background: '#1A365D' }}
          >
            {author?.name?.[0] || 'A'}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1A365D' }}>
              {author?.name || 'Author'}
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {author?.bio ||
                'An IT audit and technology risk professional with extensive experience across financial services, healthcare, and technology sectors. Background includes IT general controls testing, SOC examinations, cybersecurity assessments, and digital forensics investigations. Holds relevant certifications including CISA and CISSP.'}
            </p>
            {author?.linkedinUrl && (
              <a
                href={author.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium hover:underline"
                style={{ color: '#6366F1' }}
              >
                Connect on LinkedIn →
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section>
        <div className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-4"
          style={{ background: '#EEEEFF', color: '#6366F1', border: '1px solid #ABABF7' }}>
          Expertise
        </div>
        <h2 className="text-2xl font-bold mb-6 md:mb-8" style={{ color: '#1A365D' }}>
          Areas of Expertise
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {expertiseAreas.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-xl p-5 md:p-6 hover:shadow-sm transition-shadow">
              <div className="p-3 rounded-lg w-fit mb-4" style={{ background: '#EEEEFF' }}>
                <Icon className="w-5 h-5" style={{ color: '#6366F1' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1A365D' }}>{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
