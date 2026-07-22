import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft, MapPin } from 'lucide-react'
import type { Event, Gallery, Podcast } from '@/payload-types'

import ContentRichText from '@/components/content/ContentRichText'
import EventRelatedContent from '@/components/content/EventRelatedContent'
import SiteHeader from '@/components/SiteHeader'
import { buttonVariants } from '@/components/ui/button'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { publishedOnly } from '@/lib/content'
import { findBySlug, normalizeRouteSlug } from '@/lib/find-by-slug'
import { buildDateRangeLabel } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import { cn } from '@/lib/utils'

type EventDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = normalizeRouteSlug(rawSlug)
  const payload = await getPayload({ config })
  const event = await findBySlug<Event>(payload, { collection: 'events', slug: rawSlug })

  if (!event) return generatePageMetadata({ title: 'رویداد', path: `/events/${slug}` })

  return generatePageMetadata({
    title: event.title,
    description: event.excerpt || undefined,
    path: `/events/${event.slug}`,
  })
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const [{ slug: rawSlug }, user] = await Promise.all([params, getSession()])
  const payload = await getPayload({ config })
  const event = await findBySlug<Event>(payload, { collection: 'events', slug: rawSlug })

  if (!event) notFound()

  const [galleriesResult, podcastsResult] = await Promise.all([
    payload.find({
      collection: 'galleries',
      where: {
        and: [publishedOnly, { event: { equals: event.id } }],
      },
      sort: '-createdAt',
      limit: 12,
      depth: 1,
    }),
    payload.find({
      collection: 'podcasts',
      where: {
        and: [publishedOnly, { event: { equals: event.id } }],
      },
      sort: '-createdAt',
      limit: 12,
      depth: 1,
    }),
  ])

  const imageUrl = resolveMediaSizeUrl(event.image, 'hero')
  const dateLabel = buildDateRangeLabel(event.startDate, event.endDate)
  const occasionId =
    typeof event.relatedOccasion === 'object'
      ? event.relatedOccasion?.id
      : event.relatedOccasion

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/events"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          بازگشت به رویدادها
        </Link>

        <div className="mx-auto max-w-3xl">
          {imageUrl && (
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={imageUrl}
                alt={resolveMediaAlt(event.image, event.title)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <h1 className="text-2xl font-black sm:text-3xl">{event.title}</h1>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {dateLabel && <span>{dateLabel}</span>}
            {event.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            )}
          </div>

          {event.excerpt && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {event.excerpt}
            </p>
          )}

          {occasionId && (
            <Link
              href={`/donate?occasion=${occasionId}`}
              className={cn(buttonVariants({ size: 'lg' }), 'mt-6 gap-2')}
            >
              کمک به این برنامه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}

          {event.content && (
            <div className="mt-8 border-t border-border pt-8">
              <ContentRichText data={event.content} />
            </div>
          )}
        </div>

        <EventRelatedContent
          galleries={galleriesResult.docs as Gallery[]}
          podcasts={podcastsResult.docs as Podcast[]}
        />
      </main>
    </>
  )
}
