'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

import type { NavLinkItem } from '@/lib/navigation'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

type MobileNavProps = {
  items: NavLinkItem[]
  siteName?: string
}

export default function MobileNav({ items, siteName = 'منو' }: MobileNavProps) {
  if (!items.length) return null

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
