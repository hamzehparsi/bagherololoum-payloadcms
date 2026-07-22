import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft, CalendarRange } from 'lucide-react'

import GalleryLightbox, {
  type GalleryLightboxImage,
} from '@/components/content/GalleryLightbox'
import SiteHeader from '@/components/SiteHeader'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { findBySlug, normalizeRouteSlug } from '@/lib/find-by-slug'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl, resolveMediaUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import type { Event, Gallery, Media } from '@/payload-types'

type GalleryDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = normalizeRouteSlug(rawSlug)
  const payload = await getPayload({ config })
  const gallery = await findBySlug<Gallery>(payload, { collection: 'galleries', slug: rawSlug })
  if (!gallery) return generatePageMetadata({ title: 'گزارش تصویری', path: `/galleries/${slug}` })

  return generatePageMetadata({
    title: gallery.title,
    description: gallery.description || undefined,
    path: `/galleries/${gallery.slug}`,
  })
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const [{ slug: rawSlug }, user] = await Promise.all([params, getSession()])
  const payload = await getPayload({ config })
  const gallery = await findBySlug<Gallery>(payload, {
    collection: 'galleries',
    slug: rawSlug,
    depth: 2,
  })

  if (!gallery) notFound()

  const relatedEvent =
    typeof gallery.event === 'object' && gallery.event ? (gallery.event as Event) : null

  const mediaItems = (gallery.images || []).filter(
    (item): item is Media => typeof item === 'object' && item !== null,
  )

  const lightboxImages: GalleryLightboxImage[] = mediaItems
    .map((image) => {
      const src = resolveMediaSizeUrl(image, 'card') || resolveMediaUrl(image)
      const fullSrc = resolveMediaSizeUrl(image, 'hero') || resolveMediaUrl(image)
      if (!src || !fullSrc) return null
      return {
        id: image.id,
        src,
        fullSrc,
        alt: resolveMediaAlt(image, gallery.title),
      }
    })
    .filter((item): item is GalleryLightboxImage => item !== null)

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/galleries"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          بازگشت به گزارش‌ها
        </Link>

        <h1 className="text-2xl font-black sm:text-3xl">{gallery.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {relatedEvent?.slug ? (
            <Link
              href={`/events/${relatedEvent.slug}`}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
            >
              <CalendarRange className="h-3.5 w-3.5" />
              {relatedEvent.title}
            </Link>
          ) : null}
          <span>{formatJalaliDate(gallery.createdAt)}</span>
        </div>

        {gallery.description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {gallery.description}
          </p>
        )}

        <GalleryLightbox images={lightboxImages} />
      </main>
    </>
  )
}
