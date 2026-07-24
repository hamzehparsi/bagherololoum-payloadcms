import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

import SiteHeader from '@/components/SiteHeader'
import DonationsList, { type DonationListItem } from '@/components/profile/DonationsList'
import DonationsPagination from '@/components/profile/DonationsPagination'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { formatJalaliDateTime } from '@/lib/jalali-date'
import { generatePageMetadata } from '@/lib/page-metadata'
import { GENERAL_DONATION_TITLE } from '@/lib/payment-amounts'
import { expireStalePendingDonations } from '@/lib/donation-expiry'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'پرداخت‌های من',
    path: '/profile/donations',
    noIndex: true,
  })
}

const DONATIONS_PER_PAGE = 10

type ProfileDonationsPageProps = {
  searchParams: Promise<{ payment?: string; page?: string }>
}

export default async function ProfileDonationsPage({ searchParams }: ProfileDonationsPageProps) {
  const user = await getSession()
  if (!user) redirect('/auth')

  const params = await searchParams
  const requestedPage = Number(params.page)
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const payload = await getPayload({ config })

  await expireStalePendingDonations(payload, user.id)

  const donations = await payload.find({
    collection: 'donations',
    where: { donor: { equals: user.id } },
    sort: '-createdAt',
    limit: DONATIONS_PER_PAGE,
    page,
    depth: 1,
  })

  const items: DonationListItem[] = donations.docs.map((donation) => ({
    id: donation.id,
    amount: donation.amount,
    status: donation.status,
    trackingCode: donation.trackingCode,
    refId: donation.refId,
    createdAtLabel: formatJalaliDateTime(donation.createdAt),
    occasionTitle:
      typeof donation.occasion === 'object' && donation.occasion
        ? donation.occasion.title
        : donation.occasion == null
          ? GENERAL_DONATION_TITLE
          : null,
  }))

  return (
    <>
      <SiteHeader user={user} />
      <div className="mx-auto max-w-4xl p-6 sm:p-8">
        <h1 className="mb-6 text-xl font-bold">پرداخت‌های من</h1>

        {params.payment === 'success' && (
          <div className="mb-4 rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-3 text-sm text-brand-green">
            پرداخت با موفقیت انجام شد.
          </div>
        )}

        {params.payment === 'failed' && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            پرداخت ناموفق بود. در صورت کسر وجه، طی ۷۲ ساعت برگشت داده می‌شود.
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">هنوز پرداختی ثبت نشده است.</p>
        ) : (
          <>
            <DonationsList items={items} total={donations.totalDocs} />
            <DonationsPagination
              page={donations.page || page}
              totalPages={donations.totalPages}
              basePath="/profile/donations"
            />
          </>
        )}
      </div>
    </>
  )
}
