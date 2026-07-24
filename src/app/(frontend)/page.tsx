import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft } from 'lucide-react'

import ContentCard from '@/components/content/ContentCard'
import GalleryCard from '@/components/content/GalleryCard'
import PodcastCard from '@/components/content/PodcastCard'
import HomeWelcomeModal from '@/components/home/HomeWelcomeModal'
import EventsHeroSlider, { type EventHeroSlide } from '@/components/home/EventsHeroSlider'
import SectionHeader from '@/components/home/SectionHeader'
import SiteHeader from '@/components/SiteHeader'
import OccasionCard, { type OccasionCardData } from '@/components/home/OccasionCard'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { galleryMediaType, podcastCategoryLabels, publishedOnly } from '@/lib/content'
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
  const [
    settings,
    occasionsResult,
    stats,
    eventsResult,
    galleriesResult,
    podcastsResult,
    newsResult,
  ] = await Promise.all([
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
      limit: 6,
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

  const heroSlides: EventHeroSlide[] =
    eventsResult.docs.length > 0
      ? eventsResult.docs.map((event) => ({
          id: event.id,
          title: event.title,
          excerpt: event.excerpt,
          href: `/events/${event.slug || event.id}`,
          imageUrl: resolveMediaSizeUrl(event.image, 'hero') || resolveMediaUrl(event.image),
          imageAlt: resolveMediaAlt(event.image, event.title),
          dateLabel: buildDateRangeLabel(event.startDate, event.endDate),
        }))
      : [
          {
            id: 'site-fallback',
            title: settings.siteName || 'هیات باقرالعلوم (ع)',
            excerpt: settings.siteDescription,
            href: '/events',
            imageUrl:
              resolveMediaSizeUrl(settings.siteLogo, 'hero') || resolveMediaUrl(settings.siteLogo),
            imageAlt: settings.siteName || 'هیات باقرالعلوم (ع)',
          },
        ]

  const popupImageUrl = settings.homePopupEnabled
    ? resolveMediaSizeUrl(settings.homePopupImage, 'hero') ||
      resolveMediaUrl(settings.homePopupImage)
    : null

  return (
    <>
      <SiteHeader user={user} />

      {popupImageUrl && (
        <HomeWelcomeModal
          imageUrl={popupImageUrl}
          imageAlt={resolveMediaAlt(settings.homePopupImage, 'اطلاعیه')}
          link={settings.homePopupLink}
          openInNewTab={Boolean(settings.homePopupNewTab)}
        />
      )}

      <main>
        <EventsHeroSlider slides={heroSlides} />

        {/* رویدادها — موقتاً مخفی چون در اسلایدر نمایش داده می‌شوند
        {eventsResult.docs.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <SectionHeader title="رویدادها و برنامه‌ها" href="/events" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
        */}

        {/* مناسبت‌های کمک مالی */}
        {occasions.length > 0 && (
          <section id="occasions" className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <SectionHeader title="مناسبت‌های کمک مالی" href="/donate" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {occasions.map((occasion) => (
                <OccasionCard key={occasion.id} occasion={occasion} />
              ))}
            </div>
          </section>
        )}

        {/* حمایت عمومی */}
        <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-brand-green/20 bg-brand-green/5 p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold">{GENERAL_DONATION_TITLE}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {GENERAL_DONATION_DESCRIPTION}
              </p>
              {stats.generalRaised > 0 && (
                <p className="mt-3 text-xs font-medium text-brand-green">
                  تاکنون {formatTomans(stats.generalRaised)} از این طریق جمع شده است
                </p>
              )}
            </div>
            <Link
              href="/donate?occasion=general"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'shrink-0 gap-2 px-6',
              )}
            >
              حمایت می‌کنم
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* چندرسانه‌ای */}
        {galleriesResult.docs.length > 0 && (
          <section className="border-y border-border bg-muted/20">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
              <SectionHeader title="چندرسانه‌ای" href="/galleries" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleriesResult.docs.map((gallery) => (
                  <GalleryCard
                    key={gallery.id}
                    href={`/galleries/${gallery.slug || gallery.id}`}
                    title={gallery.title}
                    description={gallery.description}
                    date={formatJalaliDate(gallery.createdAt)}
                    mediaType={galleryMediaType(gallery)}
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
                <PodcastCard
                  key={podcast.id}
                  href={`/podcasts/${podcast.slug || podcast.id}`}
                  title={podcast.title}
                  description={podcast.description}
                  performer={podcast.performer}
                  date={formatJalaliDate(podcast.createdAt)}
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
      </main>
    </>
  )
}
