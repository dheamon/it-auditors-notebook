import type { Metadata } from 'next'
import { Shield, FileText, BarChart2, Lock, Search, Brain } from 'lucide-react'
import { getAuthor } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'About',
  description: "Learn about The IT Auditor's Notebook — a resource for IT audit, technology risk, and governance professionals.",
}

const expertiseAreas = [
  { icon: Shield, title: 'IT Audit', description: 'Planning and executing IT general controls testing, application controls reviews, and IT audit methodology in accordance with ISACA and IIA standards.' },
  { icon: FileText, title: 'SOC Reporting', description: 'SOC 1 and SOC 2 examination experience including scoping, control selection, testing, and report writing for service organizations.' },
  { icon: BarChart2, title: 'Internal Controls', description: 'Designing and evaluating internal control frameworks including COSO and COBIT for both technology and business process controls.' },
  { icon: Lock, title: 'Technology Risk', description: 'Identifying and assessing technology risks including cloud, third-party, and emerging technology risks across diverse industry environments.' },
  { icon: Search, title: 'Forensic Investigations', description: 'Conducting digital forensic investigations, fraud risk assessments, and supporting litigation involving technology evidence.' },
  { icon: Brain, title: 'AI Governance', description: 'Evaluating AI and machine learning risks, building audit programs for AI systems, and assessing governance frameworks for responsible AI use.' },
]

export default async function AboutPage() {
  const author = await getAuthor().catch(() => null)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* About the Blog */}
      <section className="mb-16">
        <div className="inline-block bg-accent-50 text-accent-DEFAULT text-sm font-medium px-3 py-1 rounded-full mb-4 border border-accent-200">
          About the Blog
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT mb-6">
          The IT Auditor&apos;s Notebook
        </h1>
        <div className="prose prose-lg text-gray-700 space-y-4 max-w-none">
          <p>
            <strong>The IT Auditor&apos;s Notebook</strong> is a professional publication focused on practical content for IT audit, technology risk,
            and governance professionals. Whether you are an experienced auditor, a risk practitioner, or someone entering the field,
            this site is built to deliver actionable insights grounded in real-world practice.
          </p>
          <p>
            Topics covered include IT general and application controls, SOC 1 and SOC 2 reporting, internal audit methodology,
            cybersecurity governance, digital forensics, AI governance, and data analytics in audit — drawing on current standards
            from ISACA, the IIA, NIST, CISA, and the AICPA.
          </p>
          <p>
            The goal is straightforward: produce the kind of content that practitioners actually find useful — clear, precise,
            and grounded in how auditing and risk management work in practice.
          </p>
        </div>
      </section>

      {/* About the Author */}
      <section className="mb-16 bg-gray-50 rounded-2xl p-8 border border-gray-100">
        <div className="inline-block bg-accent-50 text-accent-DEFAULT text-sm font-medium px-3 py-1 rounded-full mb-4 border border-accent-200">
          About the Author
        </div>
        <div className="flex gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-primary-DEFAULT flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {author?.name?.[0] || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-DEFAULT mb-3">
              {author?.name || 'Author'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {author?.bio ||
                'An IT audit and technology risk professional with extensive experience across financial services, healthcare, and technology sectors. Background includes IT general controls testing, SOC examinations, cybersecurity assessments, and digital forensics investigations. Holds relevant certifications including CISA and CISSP.'}
            </p>
            {author?.linkedinUrl && (
              <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-accent-DEFAULT hover:underline text-sm font-medium">
                Connect on LinkedIn →
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section>
        <div className="inline-block bg-accent-50 text-accent-DEFAULT text-sm font-medium px-3 py-1 rounded-full mb-4 border border-accent-200">
          Expertise
        </div>
        <h2 className="text-2xl font-bold text-primary-DEFAULT mb-8">Areas of Expertise</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertiseAreas.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-shadow">
              <div className="p-3 bg-accent-50 rounded-lg w-fit mb-4">
                <Icon className="w-5 h-5 text-accent-DEFAULT" />
              </div>
              <h3 className="font-semibold text-primary-DEFAULT mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
