import type { Metadata } from 'next'
import SearchBar from '@/components/ui/SearchBar'
import SearchResults from './SearchResults'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search all articles on IT audit, technology risk, SOC reporting, and cybersecurity.',
}

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-primary-DEFAULT mb-6">Search</h1>
      <SearchBar defaultValue={q || ''} autoFocus placeholder="Search articles, topics, tags…" />

      <div className="mt-10">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults query={q || ''} />
        </Suspense>
      </div>
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
