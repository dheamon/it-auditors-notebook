import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch with The IT Auditor's Notebook.",
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <div className="inline-block bg-accent-50 text-accent-DEFAULT text-sm font-medium px-3 py-1 rounded-full mb-4 border border-accent-200">
          Get in Touch
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT mb-3">Contact</h1>
        <p className="text-gray-600">
          Have a question, a topic suggestion, or want to discuss a collaboration? Fill out the form below.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <ContactForm />
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-primary-DEFAULT mb-1">Topic Suggestions</h3>
          <p className="text-sm text-gray-600">Know a topic that needs more coverage in the IT audit space? Let me know.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-primary-DEFAULT mb-1">Professional Inquiries</h3>
          <p className="text-sm text-gray-600">For consulting, speaking, or other professional inquiries, use the form above.</p>
        </div>
      </div>
    </div>
  )
}
