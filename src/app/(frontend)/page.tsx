import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft, HeartHandshake } from 'lucide-react'

import ContentCard from '@/components/content/ContentCard'
import SectionHeader from '@/components/home/SectionHeader'
import SiteHeader from '@/components/SiteHeader'
import OccasionCard, { type OccasionCardData } from '@/components/home/OccasionCard'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { podcastCategoryLabels, publishedOnly } from '@/lib/content'
import { generatePageMetadata } from '@/lib/page-metadata'
import { donorNeedsProfile } from '@/lib/profile'
import { getSiteSettings } from '@/lib/site-settings'
import { getDonationStats } from '@/lib/donation-stats'
import { buildOccasionDateRangeLabel, resolveOccasionImageUrl } from '@/lib/occasion-card-data'
import { buildDateRangeLabel, formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl, resolveMediaUrl } from '@/lib/media'
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
  const [settings, occasionsResult, stats, eventsResult, galleriesResult, podcastsResult, newsResult] =
    await Promise.all([
      getSiteSettings(),
      payload.find({
        collection: 'occasions',
        where: { isActive: { equals: true } },
        limit: 6,
        sort: '-createdAt',
        depth: 1,
      }),
      getDonationStats(payload),
      payload.find({
        collection: 'events',
        where: publishedOnly,
        limit: 3,
        sort: '-startDate',
        depth: 1,
      }),
      payload.find({
        collection: 'galleries',
        where: publishedOnly,
        limit: 3,
        sort: '-createdAt',
        depth: 1,
      }),
      payload.find({
        collection: 'podcasts',
        where: publishedOnly,
        limit: 3,
        sort: '-createdAt',
        depth: 1,
      }),
      payload.find({
        collection: 'news',
        where: publishedOnly,
        limit: 3,
        sort: '-publishedAt',
        depth: 1,
      }),
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

  const featuredEvent = eventsResult.docs[0]
  const heroImage =
    resolveMediaSizeUrl(featuredEvent?.image, 'hero') ||
    resolveMediaSizeUrl(settings.siteLogo, 'hero') ||
    resolveMediaUrl(settings.siteLogo)

  return (
    <>
      <SiteHeader user={user} />

      <main>
        {/* Hero — برند + یک جمله + CTA + تصویر غالب */}
        <section className="relative isolate min-h-[70vh] overflow-hidden border-b border-border">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={
                featuredEvent
                  ? resolveMediaAlt(featuredEvent.image, featuredEvent.title)
                  : settings.siteName
              }
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-stone-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />

          <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              {settings.siteName}
            </h1>
            {(settings.siteDescription || featuredEvent?.excerpt) && (
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                {featuredEvent?.excerpt || settings.siteDescription}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/donate"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'gap-2 bg-white px-6 text-emerald-900 hover:bg-white/90',
                )}
              >
                <HeartHandshake className="h-4 w-4" />
                مشارکت در کمک مالی
              </Link>
              {featuredEvent?.slug ? (
                <Link
                  href={`/events/${featuredEvent.slug}`}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white',
                  )}
                >
                  {featuredEvent.title}
                </Link>
              ) : (
                <Link
                  href="/events"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white',
                  )}
                >
                  رویدادها
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* رویدادها */}
        {eventsResult.docs.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <SectionHeader title="رویدادها و برنامه‌ها" href="/events" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventsResult.docs.map((event) => (
                <ContentCard
                  key={event.id}
                  href={`/events/${event.slug || event.id}`}
                  title={event.title}
                  description={event.excerpt}
                  meta={buildDateRangeLabel(event.startDate, event.endDate)}
                  imageUrl={resolveMediaSizeUrl(event.image, 'card')}
                  imageAlt={resolveMediaAlt(event.image, event.title)}
                />
              ))}
            </div>
          </section>
        )}

        {/* گزارش تصویری */}
        {galleriesResult.docs.length > 0 && (
          <section className="border-y border-border bg-muted/20">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
              <SectionHeader title="گزارش‌های تصویری" href="/galleries" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleriesResult.docs.map((gallery) => (
                  <ContentCard
                    key={gallery.id}
                    href={`/galleries/${gallery.slug || gallery.id}`}
                    title={gallery.title}
                    description={gallery.description}
                    meta={formatJalaliDate(gallery.createdAt)}
                    imageUrl={
                      resolveMediaSizeUrl(gallery.coverImage, 'card') ||
                      resolveMediaSizeUrl(gallery.images?.[0], 'card')
                    }
                    imageAlt={resolveMediaAlt(gallery.coverImage, gallery.title)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* صوت و پادکست */}
        {podcastsResult.docs.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <SectionHeader title="روضه، مداحی و پادکست" href="/podcasts" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {podcastsResult.docs.map((podcast) => (
                <ContentCard
                  key={podcast.id}
                  href={`/podcasts/${podcast.slug || podcast.id}`}
                  title={podcast.title}
                  description={podcast.description}
                  meta={[podcastCategoryLabels[podcast.category], podcast.performer]
                    .filter(Boolean)
                    .join(' · ')}
                  imageUrl={resolveMediaSizeUrl(podcast.coverImage, 'card')}
                  imageAlt={resolveMediaAlt(podcast.coverImage, podcast.title)}
                  badge={podcastCategoryLabels[podcast.category]}
                />
              ))}
            </div>
          </section>
        )}

        {/* اخبار */}
        {newsResult.docs.length > 0 && (
          <section className="border-y border-border bg-muted/20">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
              <SectionHeader title="آخرین اخبار" href="/news" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {newsResult.docs.map((item) => (
                  <ContentCard
                    key={item.id}
                    href={`/news/${item.slug || item.id}`}
                    title={item.title}
                    description={item.excerpt}
                    meta={formatJalaliDate(item.publishedAt || item.createdAt)}
                    imageUrl={resolveMediaSizeUrl(item.featuredImage, 'card')}
                    imageAlt={resolveMediaAlt(item.featuredImage, item.title)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* مناسبت‌های کمک مالی */}
        {occasions.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <SectionHeader title="مناسبت‌های کمک مالی" href="/donate" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {occasions.map((occasion) => (
                <OccasionCard key={occasion.id} occasion={occasion} />
              ))}
            </div>
          </section>
        )}

        {/* حمایت عمومی */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
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
              className={cn(
                buttonVariants({ size: 'lg' }),
                'shrink-0 gap-2 bg-emerald-600 px-6 hover:bg-emerald-700',
              )}
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
