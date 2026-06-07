'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CategoryBadgeProps {
  name: string
  slug?: string
  size?: 'sm' | 'md'
  className?: string
}

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 500,
  borderRadius: '9999px',
  background: '#EEEEFF',
  color: '#6366F1',
  border: '1px solid #ABABF7',
  transition: 'background 0.15s, color 0.15s',
  cursor: 'pointer',
}

export default function CategoryBadge({ name, slug, size = 'md', className }: CategoryBadgeProps) {
  const padding = size === 'sm' ? '2px 10px' : '4px 12px'
  const fontSize = size === 'sm' ? '0.75rem' : '0.875rem'

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = '#6366F1'
    e.currentTarget.style.color = '#fff'
  }
  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = '#EEEEFF'
    e.currentTarget.style.color = '#6366F1'
  }

  const style = { ...baseStyle, padding, fontSize }

  if (slug) {
    return (
      <Link
        href={`/categories/${slug}`}
        style={style}
        className={className}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {name}
      </Link>
    )
  }

  return (
    <span style={style} className={className}>
      {name}
    </span>
  )
}
