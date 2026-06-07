import Link from 'next/link'
import { ArrowRight, Shield, BarChart2, Search } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-DEFAULT via-primary-600 to-secondary-DEFAULT text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tag line */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-primary-100 mb-6">
            <Shield className="w-4 h-4 text-accent-300" />
            IT Audit &amp; Technology Risk
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Technology, Risk &amp;{' '}
            <span className="text-accent-300">Audit Insights</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-100 mb-10 leading-relaxed">
            Practical articles, audit methodologies, SOC reporting insights, forensic investigations,
            cybersecurity governance, and emerging technology risks — written for audit and risk professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/articles"
              className="inline-flex items-center justify-center gap-2 bg-accent-DEFAULT text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-600 transition-colors"
            >
              Read Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              About the Author
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20">
          {[
            { icon: Shield, label: 'IT Audit', value: 'Methodologies' },
            { icon: BarChart2, label: 'SOC Reports', value: 'Type 1 & 2' },
            { icon: Search, label: 'Forensics', value: 'Investigations' },
            { icon: Shield, label: 'AI Governance', value: 'Frameworks' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Icon className="w-5 h-5 text-accent-300" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{label}</div>
                <div className="text-primary-200 text-xs">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
