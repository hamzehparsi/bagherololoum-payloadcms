import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'
import type { Donor } from '@/payload-types'

import Header from '@/components/Header'
import type { PendingPaymentItem } from '@/components/PendingPaymentsBell'
import MobileNav from '@/components/MobileNav'
import SiteBrand from '@/components/SiteBrand'
import SiteNav from '@/components/SiteNav'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatTomans } from '@/lib/format'
import { formatJalaliDate } from '@/lib/jalali-date'
import { getOccasionTitle } from '@/lib/donation-receipt-data'
import { expireStalePendingDonations } from '@/lib/donation-expiry'
import { resolveMediaUrl } from '@/lib/media'
import { getNavigation } from '@/lib/navigation'
import { getSiteSettings } from '@/lib/site-settings'

type SiteHeaderProps = {
  user?: Donor | null
}

async function getPendingPayments(donorId: number): Promise<PendingPaymentItem[]> {
  try {
    const payload = await getPayload({ config })
    await expireStalePendingDonations(payload, donorId)
    const result = await payload.find({
      collection: 'donations',
      where: {
        and: [{ donor: { equals: donorId } }, { status: { equals: 'pending' } }],
      },
      sort: '-createdAt',
      limit: 10,
      depth: 1,
    })

    return result.docs.map((donation) => ({
      id: donation.id,
      amountLabel: formatTomans(donation.amount),
      occasionTitle: getOccasionTitle(donation.occasion),
      createdAtLabel: formatJalaliDate(donation.createdAt),
    }))
  } catch {
    return []
  }
}

export default async function SiteHeader({ user }: SiteHeaderProps) {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()])
  const navItems = navigation.headerItems || []
  const siteName = settings.siteName || 'هیات باقرالعلوم (ع)'
  const logoUrl = resolveMediaUrl(settings.siteLogo)

  if (user) {
    const pendingPayments = await getPendingPayments(user.id)
    return (
      <Header
        user={user}
        pendingPayments={pendingPayments}
        navItems={navItems}
        siteName={siteName}
        logoUrl={logoUrl}
      />
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <MobileNav items={navItems} siteName={siteName} />
          <SiteBrand siteName={siteName} logoUrl={logoUrl} />
          <SiteNav items={navItems} />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/auth" className={cn(buttonVariants({ size: 'sm' }), 'text-xs')}>
            ورود
          </Link>
        </div>
      </div>
    </header>
  )
}
