import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Author Login',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ callbackUrl?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  const { callbackUrl } = await searchParams
  const safeCallback = callbackUrl?.startsWith('/') ? callbackUrl : '/dashboard'

  return (
    <div
      className="min-h-[72vh] flex items-center justify-center px-4 py-12"
      style={{ background: '#F7FAFC' }}
    >
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ background: '#1A365D' }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#1A365D' }}>
            Author Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your writing workspace</p>
        </div>

        <LoginForm callbackUrl={safeCallback} />
      </div>
    </div>
  )
}
