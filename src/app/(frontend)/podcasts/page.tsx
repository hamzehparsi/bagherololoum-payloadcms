import type { Metadata } from 'next'
import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'

import PodcastCard from '@/components/content/PodcastCard'
import ContentPageShell from '@/components/content/ContentPageShell'
import Pagination from '@/components/content/Pagination'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import {
  CONTENT_PAGE_SIZE,
  parsePageParam,
  podcastCategoryLabels,
} from '@/lib/content'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import {
  buildPodcastWhere,
  buildPodcastsUrl,
  normalizePodcastPerformer,
  normalizePodcastTag,
} from '@/lib/podcast-filters'
import { cn } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'روضه‌ها و پادکست‌ها',
    path: '/podcasts',
    description: 'روضه، مداحی، سخنرانی و پادکست‌های هیات باقرالعلوم (ع)',
  })
}

type PodcastsPageProps = {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; performer?: string }>
}

export default async function PodcastsPage({ searchParams }: PodcastsPageProps) {
  const [user, params] = await Promise.all([getSession(), searchParams])
  const page = parsePageParam(params.page)
  const category =
    params.category && podcastCategoryLabels[params.category] ? params.category : undefined
  const tag = normalizePodcastTag(params.tag)
  const performer = normalizePodcastPerformer(params.performer)
  const payload = await getPayload({ config })

  const listFilters = { category, tag, performer }
  const where = buildPodcastWhere(listFilters)

  const result = await payload.find({
    collection: 'podcasts',
    where,
    sort: '-createdAt',
    limit: CONTENT_PAGE_SIZE,
    page,
    depth: 1,
  })

  const paginationQuery = {
    category,
    tag,
    performer,
  }

  const emptyMessage = tag
    ? `هنوز صوتی با هشتگ «${tag}» منتشر نشده است.`
    : performer
      ? `هنوز صوتی از «${performer}» منتشر نشده است.`
      : category
        ? 'هنوز صوتی در این دسته منتشر نشده است.'
        : 'هنوز صوتی منتشر نشده است.'

  return (
    <ContentPageShell
      user={user}
      title="روضه‌ها و پادکست‌ها"
      description="شنیدن روضه، مداحی، سخنرانی و پادکست‌های هیات."
    >
      {(tag || performer) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-3">
          <div className="space-y-1 text-sm">
            {tag && (
              <p>
                <span className="text-muted-foreground">فیلتر هشتگ: </span>
                <span className="font-medium text-brand-green">#{tag}</span>
              </p>
            )}
            {performer && (
              <p>
                <span className="text-muted-foreground">سخنران / مداح: </span>
                <span className="font-medium text-brand-green">{performer}</span>
              </p>
            )}
          </div>
          <Link
            href={buildPodcastsUrl({ category })}
            className="text-xs font-medium text-brand-red hover:underline"
          >
            حذف فیلتر
          </Link>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryChip
          href={buildPodcastsUrl({ tag, performer })}
          active={!category}
          label="همه"
        />
        {Object.entries(podcastCategoryLabels).map(([value, label]) => (
          <CategoryChip
            key={value}
            href={buildPodcastsUrl({ category: value, tag, performer })}
            active={category === value}
            label={label}
          />
        ))}
      </div>

      {result.docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((podcast) => (
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
          <Pagination
            page={result.page || page}
            totalPages={result.totalPages}
            basePath="/podcasts"
            query={paginationQuery}
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
          ? 'bg-brand-red text-brand-red-foreground'
          : 'border border-border bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </Link>
  )
}
