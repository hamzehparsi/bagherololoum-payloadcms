import Link from 'next/link'

import type { NavLinkItem } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type SiteNavProps = {
  items: NavLinkItem[]
  className?: string
}

export default function SiteNav({ items, className }: SiteNavProps) {
  if (!items.length) return null

  return (
    <nav className={cn('hidden items-center gap-1 md:flex', className)} aria-label="منوی اصلی">
      {items.map((item) => (
        <Link
          key={item.id || item.href}
          href={item.href}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
          className="rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
