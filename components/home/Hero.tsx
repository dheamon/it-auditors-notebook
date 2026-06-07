import { Shield, BarChart2, Search } from 'lucide-react'
import HeroButtons from './HeroButtons'

export default function Hero() {
  return (
    <section
      className="text-white py-20 md:py-28"
      style={{ background: 'linear-gradient(135deg, #1A365D 0%, #152C4E 55%, #2D3748 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tag line */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#C8D6EC' }}
          >
            <Shield className="w-4 h-4" style={{ color: '#A5B4FC' }} />
            IT Audit &amp; Technology Risk
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            Technology, Risk &amp;{' '}
            <span style={{ color: '#A5B4FC' }}>Audit Insights</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: '#C8D6EC' }}>
            Practical articles, audit methodologies, SOC reporting insights, forensic investigations,
            cybersecurity governance, and emerging technology risks — written for audit and risk professionals.
          </p>

          <HeroButtons />
        </div>

        {/* Stats strip */}
        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          {[
            { icon: Shield,    label: 'IT Audit',      value: 'Methodologies' },
            { icon: BarChart2, label: 'SOC Reports',   value: 'Type 1 & 2'   },
            { icon: Search,    label: 'Forensics',     value: 'Investigations'},
            { icon: Shield,    label: 'AI Governance', value: 'Frameworks'    },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <Icon className="w-5 h-5" style={{ color: '#A5B4FC' }} />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{label}</div>
                <div className="text-xs" style={{ color: '#91AADB' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
