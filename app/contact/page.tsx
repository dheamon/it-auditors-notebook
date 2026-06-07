import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch with The IT Auditor's Notebook.",
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="mb-8">
        <div
          className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-4"
          style={{ background: '#EEEEFF', color: '#6366F1', border: '1px solid #ABABF7' }}
        >
          Get in Touch
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#1A365D' }}>Contact</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Have a question, a topic suggestion, or want to discuss a collaboration? Fill out the form below.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm mb-8">
        <ContactForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-semibold mb-1" style={{ color: '#1A365D' }}>Topic Suggestions</h3>
          <p className="text-sm text-gray-600">Know a topic that needs more coverage in the IT audit space? Let me know.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h3 className="font-semibold mb-1" style={{ color: '#1A365D' }}>Professional Inquiries</h3>
          <p className="text-sm text-gray-600">For consulting, speaking, or other professional inquiries, use the form above.</p>
        </div>
      </div>
    </div>
  )
}
