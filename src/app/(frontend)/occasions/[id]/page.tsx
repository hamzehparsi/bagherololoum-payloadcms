import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft, CalendarRange, ImageIcon, Lock } from 'lucide-react'

import OccasionQrPanel from '@/components/donate/OccasionQrPanel'
import SiteHeader from '@/components/SiteHeader'
import { buttonVariants } from '@/components/ui/button'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { getDonationStats } from '@/lib/donation-stats'
import { formatTomans } from '@/lib/format'
import {
  buildOccasionDateRangeLabel,
  resolveOccasionImageUrl,
} from '@/lib/occasion-card-data'
import { generatePageMetadata } from '@/lib/page-metadata'
import { normalizeSiteUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'
import { cn } from '@/lib/utils'

type OccasionPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { id } = await params
  const occasionId = Number(id)
  if (!occasionId) {
    return generatePageMetadata({ title: 'مناسبت', path: `/occasions/${id}` })
  }

  const payload = await getPayload({ config })
  try {
    const occasion = await payload.findByID({
      collection: 'occasions',
      id: occasionId,
      depth: 0,
    })
    return generatePageMetadata({
      title: occasion.title,
      description: occasion.description || undefined,
      path: `/occasions/${occasion.id}`,
    })
  } catch {
    return generatePageMetadata({ title: 'مناسبت', path: `/occasions/${id}` })
  }
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const [{ id }, user, settings] = await Promise.all([
    params,
    getSession(),
    getSiteSettings(),
  ])

  const occasionId = Number(id)
  if (!occasionId) notFound()

  const payload = await getPayload({ config })

  let occasion
  try {
    occasion = await payload.findByID({
      collection: 'occasions',
      id: occasionId,
      depth: 1,
    })
  } catch {
    notFound()
  }

  if (!occasion.isActive) notFound()

  const stats = await getDonationStats(payload)
  const raised = stats.raisedByOccasion[occasion.id] || 0
  const imageUrl = resolveOccasionImageUrl(occasion)
  const dateRangeLabel = buildOccasionDateRangeLabel(occasion)
  const hasTarget = typeof occasion.targetAmount === 'number' && occasion.targetAmount > 0
  const percent = hasTarget
    ? Math.min(100, Math.round((raised / occasion.targetAmount!) * 100))
    : null

  const siteUrl =
    normalizeSiteUrl(settings.siteUrl) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000'
  const donateUrl = `${siteUrl.replace(/\/$/, '')}/donate?occasion=${occasion.id}`
  const siteName = settings.siteName || 'هیات باقرالعلوم (ع)'

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/#occasions"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          بازگشت به مناسبت‌ها
        </Link>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative h-48 w-full bg-muted sm:h-56">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={occasion.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-red/10 via-muted to-brand-green/10">
                <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6">
            <h1 className="text-2xl font-black sm:text-3xl">{occasion.title}</h1>

            {dateRangeLabel && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarRange className="h-4 w-4 shrink-0" />
                {dateRangeLabel}
              </p>
            )}

            {occasion.isFixedAmount && occasion.fixedAmount != null && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-red/10 px-3 py-1 text-xs font-bold text-brand-red">
                <Lock className="h-3.5 w-3.5" />
                مبلغ ثابت: {formatTomans(occasion.fixedAmount)}
              </p>
            )}

            {occasion.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {occasion.description}
              </p>
            )}

            {hasTarget ? (
              <div className="mt-5 space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand-green transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-brand-green">
                    {formatTomans(raised)} جمع شده
                  </span>
                  <span className="text-muted-foreground">
                    هدف: {formatTomans(occasion.targetAmount!)}
                  </span>
                </div>
              </div>
            ) : raised > 0 ? (
              <p className="mt-4 text-sm font-medium text-brand-green">
                تاکنون {formatTomans(raised)} جمع شده است
              </p>
            ) : null}

            <Link
              href={`/donate?occasion=${occasion.id}`}
              className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'mt-6 w-full gap-1.5')}
            >
              مشارکت در این مناسبت
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <OccasionQrPanel title={occasion.title} donateUrl={donateUrl} siteName={siteName} />
        </div>
      </main>
    </>
  )
}
