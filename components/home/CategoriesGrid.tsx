import Link from 'next/link'
import { Shield, FileText, Users, Lock, BarChart2, Search, Brain, Database } from 'lucide-react'

const categories = [
  { name: 'IT Audit', slug: 'it-audit', icon: Shield, description: 'Methodologies, frameworks, and best practices' },
  { name: 'SOC Reports', slug: 'soc-reports', icon: FileText, description: 'SOC 1, SOC 2, and SOC 3 reporting guidance' },
  { name: 'Internal Audit', slug: 'internal-audit', icon: Users, description: 'Strategies, tools, and techniques' },
  { name: 'Cybersecurity', slug: 'cybersecurity', icon: Lock, description: 'Governance, controls, and risk management' },
  { name: 'Technology Risk', slug: 'technology-risk', icon: BarChart2, description: 'Emerging risks and mitigation strategies' },
  { name: 'Forensics', slug: 'forensics', icon: Search, description: 'Digital forensics and fraud examination' },
  { name: 'AI Governance', slug: 'ai-governance', icon: Brain, description: 'AI risk and governance frameworks' },
  { name: 'Data Analytics', slug: 'data-analytics', icon: Database, description: 'Analytics in audit and continuous monitoring' },
]

export default function CategoriesGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-DEFAULT mb-3">Browse by Topic</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Deep-dive content across the full spectrum of IT audit, risk, and governance disciplines.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(({ name, slug, icon: Icon, description }) => (
            <Link
              key={slug}
              href={`/categories/${slug}`}
              className="group flex flex-col p-6 bg-gray-50 border border-gray-100 rounded-xl hover:bg-primary-DEFAULT hover:border-primary-DEFAULT transition-all duration-200"
            >
              <div className="p-3 bg-accent-50 group-hover:bg-white/20 rounded-lg w-fit mb-4 transition-colors">
                <Icon className="w-6 h-6 text-accent-DEFAULT group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-primary-DEFAULT group-hover:text-white mb-1 transition-colors">{name}</h3>
              <p className="text-sm text-gray-500 group-hover:text-primary-100 transition-colors leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
