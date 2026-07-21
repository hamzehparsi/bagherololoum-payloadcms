import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft, HandCoins, HeartHandshake, Users } from 'lucide-react'

import SiteHeader from '@/components/SiteHeader'
import OccasionCard, { type OccasionCardData } from '@/components/home/OccasionCard'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { generatePageMetadata } from '@/lib/page-metadata'
import { donorNeedsProfile } from '@/lib/profile'
import { getSiteSettings } from '@/lib/site-settings'
import { getDonationStats } from '@/lib/donation-stats'
import { buildOccasionDateRangeLabel, resolveOccasionImageUrl } from '@/lib/occasion-card-data'
import { formatTomans } from '@/lib/format'
import { GENERAL_DONATION_DESCRIPTION, GENERAL_DONATION_TITLE } from '@/lib/payment-amounts'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return generatePageMetadata({
    path: '/',
    description: settings.siteDescription || undefined,
  })
}

export default async function HomePage() {
  const user = await getSession()

  if (user && donorNeedsProfile(user)) {
    redirect('/profile/complete')
  }

  const payload = await getPayload({ config })
  const [settings, occasionsResult, stats] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'occasions',
      where: { isActive: { equals: true } },
      limit: 12,
      sort: '-createdAt',
    }),
    getDonationStats(payload),
  ])

  const occasions: OccasionCardData[] = occasionsResult.docs.map((occasion) => ({
    id: occasion.id,
    title: occasion.title,
    description: occasion.description,
    isFixedAmount: occasion.isFixedAmount,
    fixedAmount: occasion.fixedAmount,
    targetAmount: occasion.targetAmount,
    raised: stats.raisedByOccasion[occasion.id] || 0,
    imageUrl: resolveOccasionImageUrl(occasion),
    dateRangeLabel: buildOccasionDateRangeLabel(occasion),
  }))

  return (
    <>
      <SiteHeader user={user} />

      <main>
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20">
            <h1 className="text-2xl font-black leading-tight sm:text-4xl">
              {settings.siteName}
            </h1>
            {settings.siteDescription && (
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {settings.siteDescription}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/donate" className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-6')}>
                <HeartHandshake className="h-4 w-4" />
                مشارکت در کمک مالی
              </Link>
              {!user && (
                <Link
                  href="/auth"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-6')}
                >
                  ورود / ثبت‌نام
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <HandCoins className="mx-auto h-6 w-6 text-emerald-600" />
              <p className="mt-3 text-xl font-black">{formatTomans(stats.totalRaised)}</p>
              <p className="mt-1 text-xs text-muted-foreground">جمع کمک‌های جمع‌آوری‌شده</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <Users className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-3 text-xl font-black">
                {stats.successCount.toLocaleString('fa-IR')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">پرداخت موفق</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <HeartHandshake className="mx-auto h-6 w-6 text-rose-500" />
              <p className="mt-3 text-xl font-black">
                {occasions.length.toLocaleString('fa-IR')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">مناسبت فعال</p>
            </div>
          </div>
        </section>

        {/* Occasions */}
        {occasions.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">مناسبت‌های فعال</h2>
              <Link
                href="/donate"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                مشاهده همه
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {occasions.map((occasion) => (
                <OccasionCard key={occasion.id} occasion={occasion} />
              ))}
            </div>
          </section>
        )}

        {/* General support */}
        <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold">{GENERAL_DONATION_TITLE}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {GENERAL_DONATION_DESCRIPTION}
              </p>
              {stats.generalRaised > 0 && (
                <p className="mt-3 text-xs font-medium text-emerald-700">
                  تاکنون {formatTomans(stats.generalRaised)} از این طریق جمع شده است
                </p>
              )}
            </div>
            <Link
              href="/donate?occasion=general"
              className={cn(buttonVariants({ size: 'lg' }), 'shrink-0 gap-2 bg-emerald-600 px-6 hover:bg-emerald-700')}
            >
              حمایت می‌کنم
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
