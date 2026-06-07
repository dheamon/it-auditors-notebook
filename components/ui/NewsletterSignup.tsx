'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

interface NewsletterSignupProps {
  variant?: 'inline' | 'banner'
}

export default function NewsletterSignup({ variant = 'banner' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || "You're subscribed! Welcome aboard.")
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={variant === 'banner' ? { background: '#1A365D' } : {}}
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="font-medium text-white">{message}</p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="rounded-xl p-6" style={{ background: '#EEEEFF', border: '1px solid #ABABF7' }}>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5" style={{ color: '#6366F1' }} />
          <h3 className="font-semibold" style={{ color: '#1A365D' }}>Stay in the loop</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Get practical IT audit and technology risk insights delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
            style={{ outline: 'none' }}
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #6366F1')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            style={{ background: '#6366F1' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4547D6')}
            onMouseLeave={e => (e.currentTarget.style.background = '#6366F1')}
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
          {status === 'error' && <p className="text-red-600 text-xs">{message}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="rounded-xl p-8 md:p-12" style={{ background: '#1A365D' }}>
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-10 h-10 mx-auto mb-4" style={{ color: '#A5B4FC' }} />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Get Audit Insights in Your Inbox
        </h2>
        <p className="mb-8" style={{ color: '#91AADB' }}>
          Practical articles on IT audit, SOC reporting, cybersecurity governance, and emerging
          technology risks. No spam — unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-800 text-sm focus:outline-none"
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #A5B4FC')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-800 text-sm focus:outline-none"
            onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #A5B4FC')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-60 whitespace-nowrap text-sm"
            style={{ background: '#6366F1' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4547D6')}
            onMouseLeave={e => (e.currentTarget.style.background = '#6366F1')}
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        {status === 'error' && <p className="text-red-300 text-sm mt-3">{message}</p>}
      </div>
    </div>
  )
}
