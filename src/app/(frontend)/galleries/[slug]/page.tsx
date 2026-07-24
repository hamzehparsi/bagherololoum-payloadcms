import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft, CalendarDays, CalendarRange, ImageIcon, Video } from 'lucide-react'

import GalleryLightbox, {
  type GalleryLightboxImage,
} from '@/components/content/GalleryLightbox'
import VideoPlayer from '@/components/content/VideoPlayer'
import SiteHeader from '@/components/SiteHeader'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { galleryMediaType } from '@/lib/content'
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
  if (!gallery) return generatePageMetadata({ title: 'چندرسانه‌ای', path: `/galleries/${slug}` })

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

  const mediaType = galleryMediaType(gallery)
  const TypeIcon = mediaType === 'video' ? Video : ImageIcon
  const typeLabel = mediaType === 'video' ? 'ویدیو' : 'گزارش تصویری'

  const mediaItems = (gallery.images || []).filter(
    (item): item is Media => typeof item === 'object' && item !== null,
  )

  const videoItems = (gallery.videos || [])
    .map((item) => {
      if (typeof item !== 'object' || item === null) return null
      const url = resolveMediaUrl(item)
      if (!url) return null
      return { ...item, url }
    })
    .filter((item): item is Media & { url: string } => item !== null)

  const videoPoster =
    resolveMediaSizeUrl(gallery.coverImage, 'hero') || resolveMediaUrl(gallery.coverImage)

  const lightboxImages: GalleryLightboxImage[] = mediaItems
    .map((image): GalleryLightboxImage | null => {
      // برای لایت‌باکس از فایل اصلی استفاده می‌شود تا افقی/عمودی کراپ نشود
      const fullSrc = resolveMediaUrl(image) || resolveMediaSizeUrl(image, 'hero')
      const src = resolveMediaSizeUrl(image, 'card') || fullSrc
      if (!src || !fullSrc) return null
      return {
        id: image.id,
        src,
        fullSrc,
        alt: resolveMediaAlt(image, gallery.title),
        width: image.width,
        height: image.height,
        filename: image.filename,
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

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-2.5 py-1.5 text-xs font-semibold text-white">
            <TypeIcon className="h-4 w-4" strokeWidth={2.25} />
            {typeLabel}
          </span>

          {relatedEvent?.slug ? (
            <Link
              href={`/events/${relatedEvent.slug}`}
              className="inline-flex items-center gap-1.5 font-medium text-brand-red hover:underline"
            >
              <CalendarRange className="h-3.5 w-3.5" />
              {relatedEvent.title}
            </Link>
          ) : null}

          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-brand-red/80" />
            {formatJalaliDate(gallery.createdAt)}
          </span>
        </div>

        {gallery.description && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {gallery.description}
          </p>
        )}

        {videoItems.length > 0 ? (
          <div className="mt-8 space-y-6">
            {videoItems.map((video) => (
              <VideoPlayer
                key={video.id}
                src={video.url}
                poster={videoPoster}
                title={gallery.title}
              />
            ))}
          </div>
        ) : mediaType === 'video' ? (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
            برای این گزارش هنوز ویدیویی بارگذاری نشده است.
          </p>
        ) : null}

        <GalleryLightbox images={lightboxImages} />
      </main>
    </>
  )
}
