import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft } from 'lucide-react'

import AudioPlayer from '@/components/content/AudioPlayer'
import ContentRichText from '@/components/content/ContentRichText'
import PodcastHashtags from '@/components/content/PodcastHashtags'
import SiteHeader from '@/components/SiteHeader'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { podcastCategoryLabels } from '@/lib/content'
import { findBySlug, normalizeRouteSlug } from '@/lib/find-by-slug'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl, resolveMediaUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import { podcastPerformerHref } from '@/lib/podcast-filters'
import type { Podcast } from '@/payload-types'

type PodcastDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PodcastDetailPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = normalizeRouteSlug(rawSlug)
  const payload = await getPayload({ config })
  const podcast = await findBySlug<Podcast>(payload, { collection: 'podcasts', slug: rawSlug })
  if (!podcast) return generatePageMetadata({ title: 'صوت', path: `/podcasts/${slug}` })

  return generatePageMetadata({
    title: podcast.title,
    description: podcast.description || undefined,
    path: `/podcasts/${podcast.slug}`,
  })
}

export default async function PodcastDetailPage({ params }: PodcastDetailPageProps) {
  const [{ slug: rawSlug }, user] = await Promise.all([params, getSession()])
  const payload = await getPayload({ config })
  const podcast = await findBySlug<Podcast>(payload, {
    collection: 'podcasts',
    slug: rawSlug,
    depth: 1,
  })

  if (!podcast) notFound()

  const audioUrl = resolveMediaUrl(podcast.audio)
  const coverUrl = resolveMediaSizeUrl(podcast.coverImage, 'card')
  const relatedEvent =
    typeof podcast.event === 'object' && podcast.event ? podcast.event : null

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/podcasts"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          بازگشت به صوت‌ها
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {coverUrl && (
            <div className="relative mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-2xl bg-muted sm:mx-0">
              <Image
                src={coverUrl}
                alt={resolveMediaAlt(podcast.coverImage, podcast.title)}
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-full bg-brand-red/10 px-3 py-1 text-xs font-medium text-brand-red">
              {podcastCategoryLabels[podcast.category]}
            </span>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">{podcast.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {podcast.performer && (
                <Link
                  href={podcastPerformerHref(podcast.performer)}
                  className="font-medium text-brand-red hover:underline"
                >
                  {podcast.performer}
                </Link>
              )}
              {relatedEvent?.slug ? (
                <Link
                  href={`/events/${relatedEvent.slug}`}
                  className="font-medium text-brand-red hover:underline"
                >
                  {relatedEvent.title}
                </Link>
              ) : null}
              <span>{formatJalaliDate(podcast.createdAt)}</span>
            </div>
            {podcast.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {podcast.description}
              </p>
            )}
            <PodcastHashtags hashtags={podcast.hashtags} className="mt-4" />
          </div>
        </div>

        {audioUrl ? (
          <div className="mt-8">
            <AudioPlayer src={audioUrl} title="پخش صوت" />
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">فایل صوتی در دسترس نیست.</p>
        )}

        {podcast.speechText && (
          <section className="mt-10 border-t border-border pt-8">
            <h2 className="mb-4 text-lg font-bold">متن سخنرانی</h2>
            <ContentRichText data={podcast.speechText} />
          </section>
        )}
      </main>
    </>
  )
}
