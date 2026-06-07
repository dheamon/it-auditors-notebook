import { createClient } from '@sanity/client'

/**
 * A Sanity client configured for server-side write operations.
 * Never exposed to the browser — only used in API routes and server components.
 * useCdn: false ensures mutations go directly to the Sanity API.
 */
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zdoqt5st',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
