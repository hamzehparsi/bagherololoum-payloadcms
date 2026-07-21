import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'
import type { Donor } from '@/payload-types'

import Header from '@/components/Header'
import type { PendingPaymentItem } from '@/components/PendingPaymentsBell'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatTomans } from '@/lib/format'
import { formatJalaliDate } from '@/lib/jalali-date'
import { getOccasionTitle } from '@/lib/donation-receipt-data'
import { expireStalePendingDonations } from '@/lib/donation-expiry'

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
  if (user) {
    const pendingPayments = await getPendingPayments(user.id)
    return <Header user={user} pendingPayments={pendingPayments} />
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-base font-bold text-foreground">
          هیات باقرالعلوم (ع)
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/donate" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs')}>
            کمک مالی
          </Link>
          <Link href="/auth" className={cn(buttonVariants({ size: 'sm' }), 'text-xs')}>
            ورود
          </Link>
        </div>
      </div>
    </header>
  )
}
