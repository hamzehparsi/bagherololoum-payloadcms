import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import ContentCard from '@/components/content/ContentCard'
import SectionHeader from '@/components/home/SectionHeader'
import { podcastCategoryLabels } from '@/lib/content'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl, resolveMediaUrl } from '@/lib/media'
import type { Gallery, Podcast } from '@/payload-types'

type EventRelatedContentProps = {
  galleries: Gallery[]
  podcasts: Podcast[]
}

function galleryCover(gallery: Gallery): string | null {
  return (
    resolveMediaSizeUrl(gallery.coverImage, 'card') ||
    resolveMediaSizeUrl(gallery.images?.[0], 'card') ||
    resolveMediaUrl(gallery.coverImage) ||
    resolveMediaUrl(gallery.images?.[0])
  )
}

export default function EventRelatedContent({ galleries, podcasts }: EventRelatedContentProps) {
  if (galleries.length === 0 && podcasts.length === 0) return null

  return (
    <div className="mt-12 space-y-10 border-t border-border pt-10">
      {galleries.length > 0 && (
        <section>
          <SectionHeader title="گزارش‌های تصویری این رویداد" href="/galleries" />
          <div className="grid gap-4 sm:grid-cols-2">
            {galleries.map((gallery) => (
              <ContentCard
                key={gallery.id}
                href={`/galleries/${gallery.slug || gallery.id}`}
                title={gallery.title}
                description={gallery.description}
                meta={formatJalaliDate(gallery.createdAt)}
                imageUrl={galleryCover(gallery)}
                imageAlt={resolveMediaAlt(gallery.coverImage, gallery.title)}
              />
            ))}
          </div>
        </section>
      )}

      {podcasts.length > 0 && (
        <section>
          <SectionHeader title="روضه و پادکست‌های این رویداد" href="/podcasts" />
          <div className="grid gap-4 sm:grid-cols-2">
            {podcasts.map((podcast) => (
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

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/events" className="inline-flex items-center gap-1 hover:text-foreground">
          بازگشت به همه رویدادها
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </p>
    </div>
  )
}
