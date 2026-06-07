'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-400 transition-colors"

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <CheckCircle className="w-14 h-14 text-green-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2" style={{ color: '#1A365D' }}>Message Received</h2>
        <p className="text-gray-600">Thank you for reaching out. I&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email — stack on mobile, side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            id="name" name="name" type="text"
            value={form.name} onChange={handleChange}
            required className={inputClass} placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            id="email" name="email" type="email"
            value={form.email} onChange={handleChange}
            required className={inputClass} placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
        <select
          id="subject" name="subject"
          value={form.subject} onChange={handleChange}
          required className={inputClass}
        >
          <option value="">Select a subject</option>
          <option value="topic-suggestion">Topic Suggestion</option>
          <option value="general-inquiry">General Inquiry</option>
          <option value="collaboration">Collaboration</option>
          <option value="speaking">Speaking Inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
        <textarea
          id="message" name="message"
          value={form.message} onChange={handleChange}
          required rows={6}
          className={inputClass + ' resize-none'}
          placeholder="How can I help you?"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-60 text-sm"
        style={{ background: '#1A365D' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#152C4E')}
        onMouseLeave={e => (e.currentTarget.style.background = '#1A365D')}
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
