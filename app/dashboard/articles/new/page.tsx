import type { Metadata } from 'next'
import NewArticleForm from './NewArticleForm'

export const metadata: Metadata = {
  title: 'New Article — Dashboard',
  robots: { index: false, follow: false },
}

export default function NewArticlePage() {
  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1A365D' }}>
          New Article
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a draft. You can edit everything in the editor.
        </p>
      </div>
      <NewArticleForm />
    </div>
  )
}
