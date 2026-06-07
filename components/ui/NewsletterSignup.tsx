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
        setMessage(data.message || 'You\'re subscribed! Welcome aboard.')
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
      <div className={variant === 'banner' ? 'bg-primary-DEFAULT rounded-xl p-8 text-center' : 'text-center py-4'}>
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className={variant === 'banner' ? 'text-white font-medium' : 'text-primary-DEFAULT font-medium'}>{message}</p>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-accent-DEFAULT" />
          <h3 className="font-semibold text-primary-DEFAULT">Stay in the loop</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">Get practical IT audit and technology risk insights delivered to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-DEFAULT"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-accent-DEFAULT text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
          {status === 'error' && <p className="text-red-600 text-xs">{message}</p>}
        </form>
      </div>
    )
  }

  return (
    <div className="bg-primary-DEFAULT rounded-xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-10 h-10 text-accent-300 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Get Audit Insights in Your Inbox
        </h2>
        <p className="text-primary-200 mb-8">
          Practical articles on IT audit, SOC reporting, cybersecurity governance, and emerging technology risks.
          No spam — unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent-300 text-gray-800 text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent-300 text-gray-800 text-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-accent-DEFAULT text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-600 transition-colors disabled:opacity-60 whitespace-nowrap text-sm"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
        {status === 'error' && <p className="text-red-300 text-sm mt-3">{message}</p>}
      </div>
    </div>
  )
}
