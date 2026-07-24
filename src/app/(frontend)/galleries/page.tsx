import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import GalleryCard from '@/components/content/GalleryCard'
import ContentPageShell from '@/components/content/ContentPageShell'
import Pagination from '@/components/content/Pagination'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { CONTENT_PAGE_SIZE, galleryMediaType, parsePageParam, publishedOnly } from '@/lib/content'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl, resolveMediaUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import type { Gallery } from '@/payload-types'

function galleryCoverUrl(gallery: Gallery): string | null {
  const firstImage = gallery.images?.[0]
  return (
    resolveMediaSizeUrl(gallery.coverImage, 'card') ||
    resolveMediaSizeUrl(firstImage, 'card') ||
    resolveMediaUrl(gallery.coverImage) ||
    resolveMediaUrl(firstImage)
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'چندرسانه‌ای',
    path: '/galleries',
    description: 'گزارش‌های تصویری و ویدیویی برنامه‌ها و مراسم هیات باقرالعلوم (ع)',
  })
}

type GalleriesPageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function GalleriesPage({ searchParams }: GalleriesPageProps) {
  const [user, params] = await Promise.all([getSession(), searchParams])
  const page = parsePageParam(params.page)
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'galleries',
    where: publishedOnly,
    sort: '-createdAt',
    limit: CONTENT_PAGE_SIZE,
    page,
    depth: 1,
  })

  return (
    <ContentPageShell
      user={user}
      title="چندرسانه‌ای"
      description="تصاویر و ویدیوهای برنامه‌ها و شب‌های هیات."
    >
      {result.docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">هنوز گزارشی منتشر نشده است.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                href={`/galleries/${gallery.slug || gallery.id}`}
                title={gallery.title}
                description={gallery.description}
                date={formatJalaliDate(gallery.createdAt)}
                mediaType={galleryMediaType(gallery)}
                imageUrl={galleryCoverUrl(gallery)}
                imageAlt={resolveMediaAlt(gallery.coverImage, gallery.title)}
              />
            ))}
          </div>
          <Pagination
            page={result.page || page}
            totalPages={result.totalPages}
            basePath="/galleries"
            label="صفحه‌بندی گزارش‌ها"
          />
        </>
      )}
    </ContentPageShell>
  )
}
