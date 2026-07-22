import type { Metadata } from 'next'
import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'

import ContentCard from '@/components/content/ContentCard'
import ContentPageShell from '@/components/content/ContentPageShell'
import Pagination from '@/components/content/Pagination'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import {
  CONTENT_PAGE_SIZE,
  parsePageParam,
  podcastCategoryLabels,
  publishedOnly,
} from '@/lib/content'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'روضه‌ها و پادکست‌ها',
    path: '/podcasts',
    description: 'روضه، مداحی، سخنرانی و پادکست‌های هیات باقرالعلوم (ع)',
  })
}

type PodcastsPageProps = {
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function PodcastsPage({ searchParams }: PodcastsPageProps) {
  const [user, params] = await Promise.all([getSession(), searchParams])
  const page = parsePageParam(params.page)
  const category =
    params.category && podcastCategoryLabels[params.category] ? params.category : undefined
  const payload = await getPayload({ config })

  const where = category
    ? { and: [publishedOnly, { category: { equals: category } }] }
    : publishedOnly

  const result = await payload.find({
    collection: 'podcasts',
    where,
    sort: '-createdAt',
    limit: CONTENT_PAGE_SIZE,
    page,
    depth: 1,
  })

  return (
    <ContentPageShell
      user={user}
      title="روضه‌ها و پادکست‌ها"
      description="شنیدن روضه، مداحی، سخنرانی و پادکست‌های هیات."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryChip href="/podcasts" active={!category} label="همه" />
        {Object.entries(podcastCategoryLabels).map(([value, label]) => (
          <CategoryChip
            key={value}
            href={`/podcasts?category=${value}`}
            active={category === value}
            label={label}
          />
        ))}
      </div>

      {result.docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">هنوز صوتی در این دسته منتشر نشده است.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((podcast) => (
              <ContentCard
                key={podcast.id}
                href={`/podcasts/${podcast.slug || podcast.id}`}
                title={podcast.title}
                description={podcast.description}
                meta={[
                  podcastCategoryLabels[podcast.category],
                  podcast.performer,
                  formatJalaliDate(podcast.createdAt),
                ]
                  .filter(Boolean)
                  .join(' · ')}
                imageUrl={resolveMediaSizeUrl(podcast.coverImage, 'card')}
                imageAlt={resolveMediaAlt(podcast.coverImage, podcast.title)}
                badge={podcastCategoryLabels[podcast.category]}
              />
            ))}
          </div>
          <Pagination
            page={result.page || page}
            totalPages={result.totalPages}
            basePath="/podcasts"
            query={{ category }}
            label="صفحه‌بندی صوت‌ها"
          />
        </>
      )}
    </ContentPageShell>
  )
}

function CategoryChip({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'border border-border bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </Link>
  )
}
