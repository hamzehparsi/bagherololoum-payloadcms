'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import type { NavLinkItem } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type SiteNavProps = {
  items: NavLinkItem[]
  aboutItems?: NavLinkItem[]
  className?: string
}

export default function SiteNav({ items, aboutItems = [], className }: SiteNavProps) {
  if (!items.length && !aboutItems.length) return null

  return (
    <nav className={cn('hidden items-center gap-1 md:flex', className)} aria-label="منوی اصلی">
      {aboutItems.length > 0 && (
        <div className="group relative">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-haspopup="menu"
          >
            پیرامون هیات
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          <div
            className={cn(
              'invisible absolute top-full right-0 z-50 pt-2 opacity-0 transition-all duration-200',
              'group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
            )}
          >
            <div
              role="menu"
              className="min-w-[14rem] overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_30px_-16px_rgba(0,0,0,0.25)]"
            >
              {aboutItems.map((item, index) => (
                <Link
                  key={item.id || item.href}
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  role="menuitem"
                  className={cn(
                    'block px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-brand-red/5 hover:text-brand-red',
                    index < aboutItems.length - 1 && 'border-b border-border/70',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

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
