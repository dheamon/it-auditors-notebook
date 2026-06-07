import Image from 'next/image'
import Link from 'next/link'
import { urlForImage } from '@/lib/sanity'
import type { SanityImage } from '@/types'
import { Info, AlertTriangle, Lightbulb, Star } from 'lucide-react'
import type {
  PortableTextComponentProps,
  PortableTextMarkComponentProps,
  PortableTextBlock,
} from '@portabletext/react'

const calloutIcons = {
  info: { icon: Info, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon_color: 'text-blue-500' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', icon_color: 'text-yellow-500' },
  tip: { icon: Lightbulb, bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon_color: 'text-green-500' },
  important: { icon: Star, bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', icon_color: 'text-purple-500' },
}

type CalloutValue = { type: keyof typeof calloutIcons; content: string }
type ImageValue = SanityImage & { alt?: string; caption?: string }
type LinkValue = { _type: string; href?: string; blank?: boolean }

export const portableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      <figure className="my-8">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={urlForImage(value, 1200, 675)}
            alt={value.alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
        {value.caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
    callout: ({ value }: { value: CalloutValue }) => {
      const config = calloutIcons[value.type] || calloutIcons.info
      const Icon = config.icon
      return (
        <div className={`my-6 p-4 rounded-xl border ${config.bg} flex gap-3`}>
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.icon_color}`} />
          <p className={`text-sm ${config.text}`}>{value.content}</p>
        </div>
      )
    },
  },
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<LinkValue>) => (
      <Link
        href={value?.href || '#'}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-accent-DEFAULT underline hover:text-primary-DEFAULT"
      >
        {children}
      </Link>
    ),
    code: ({ children }: PortableTextMarkComponentProps) => (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
  },
  block: {
    h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h2 className="text-2xl font-bold text-primary-DEFAULT mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h3 className="text-xl font-semibold text-primary-DEFAULT mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h4 className="text-lg font-semibold text-secondary-DEFAULT mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <blockquote className="border-l-4 border-accent-DEFAULT pl-6 py-2 my-6 bg-accent-50 rounded-r-xl">
        <p className="text-secondary-DEFAULT italic">{children}</p>
      </blockquote>
    ),
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <ul className="list-disc list-inside space-y-1 mb-4 ml-4 text-gray-700">{children}</ul>
    ),
    number: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 ml-4 text-gray-700">{children}</ol>
    ),
  },
}
