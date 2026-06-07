import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  name: string
  slug?: string
  size?: 'sm' | 'md'
  className?: string
}

export default function CategoryBadge({ name, slug, size = 'md', className }: CategoryBadgeProps) {
  const classes = cn(
    'inline-flex items-center font-medium rounded-full bg-accent-50 text-accent-DEFAULT border border-accent-200 hover:bg-accent-DEFAULT hover:text-white transition-colors',
    size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1',
    className
  )

  if (slug) {
    return (
      <Link href={`/categories/${slug}`} className={classes}>
        {name}
      </Link>
    )
  }

  return <span className={classes}>{name}</span>
}
