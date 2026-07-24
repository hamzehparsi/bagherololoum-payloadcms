'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu } from 'lucide-react'

import type { NavLinkItem } from '@/lib/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type MobileNavProps = {
  items: NavLinkItem[]
  aboutItems?: NavLinkItem[]
  siteName?: string
}

export default function MobileNav({
  items,
  aboutItems = [],
  siteName = 'منو',
}: MobileNavProps) {
  const [aboutOpen, setAboutOpen] = useState(false)

  if (!items.length && !aboutItems.length) return null

  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:hidden"
        aria-label="باز کردن منو"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,20rem)]" dir="rtl">
        <SheetHeader>
          <SheetTitle>{siteName}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1" aria-label="منوی موبایل">
          {aboutItems.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setAboutOpen((open) => !open)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                aria-expanded={aboutOpen}
              >
                پیرامون هیات
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', aboutOpen && 'rotate-180')}
                />
              </button>
              {aboutOpen && (
                <div className="mt-1 border-r border-border/70 pr-3 mr-3">
                  {aboutItems.map((item, index) => (
                    <Link
                      key={item.id || item.href}
                      href={item.href}
                      target={item.openInNewTab ? '_blank' : undefined}
                      rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'block px-3 py-2.5 text-base text-muted-foreground hover:bg-muted hover:text-foreground',
                        index < aboutItems.length - 1 && 'border-b border-border/70',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {items.map((item) => (
            <Link
              key={item.id || item.href}
              href={item.href}
              target={item.openInNewTab ? '_blank' : undefined}
              rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
