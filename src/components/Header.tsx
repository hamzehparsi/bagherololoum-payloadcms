import type { Donor } from '@/payload-types'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { logout } from '@/app/(frontend)/auth/actions/logout'
import { getDonorDisplayName } from '@/lib/profile'
import { resolveDonorAvatarUrl } from '@/lib/media'
import PendingPaymentsBell, { type PendingPaymentItem } from '@/components/PendingPaymentsBell'
import MobileNav from '@/components/MobileNav'
import SiteBrand from '@/components/SiteBrand'
import SiteNav from '@/components/SiteNav'
import type { NavLinkItem } from '@/lib/navigation'

type HeaderProps = {
  user: Donor
  pendingPayments?: PendingPaymentItem[]
  navItems?: NavLinkItem[]
  aboutItems?: NavLinkItem[]
  siteName?: string
  logoUrl?: string | null
}

export default function Header({
  user,
  pendingPayments = [],
  navItems = [],
  aboutItems = [],
  siteName,
  logoUrl,
}: HeaderProps) {
  const name = siteName || 'هیات باقرالعلوم (ع)'
  const displayName = getDonorDisplayName(user)
  const avatarUrl = resolveDonorAvatarUrl(user.avatar, user.avatarPreset)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <MobileNav items={navItems} aboutItems={aboutItems} siteName={name} />
          <SiteBrand siteName={name} logoUrl={logoUrl} />
          <SiteNav items={navItems} aboutItems={aboutItems} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <PendingPaymentsBell items={pendingPayments} />

          <Link
            href="/profile"
            className="group flex w-auto max-w-[20rem] items-center gap-3 rounded-full px-4 py-2 transition-all hover:bg-brand-green/[0.08]"
            aria-label="پروفایل کاربری"
          >
            <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-white/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </span>
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-xs font-bold leading-tight text-brand-green sm:text-sm">
                {displayName}
              </p>
              <p
                className="truncate text-[10px] leading-tight text-muted-foreground sm:text-[11px]"
                dir="ltr"
              >
                {user.username}
              </p>
            </div>
          </Link>

          <form action={logout}>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="h-10 gap-1.5 rounded-full px-2.5 text-xs text-muted-foreground hover:bg-brand-red/8 hover:text-brand-red"
              aria-label="خروج"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
