import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import ContentCard from '@/components/content/ContentCard'
import ContentPageShell from '@/components/content/ContentPageShell'
import Pagination from '@/components/content/Pagination'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { CONTENT_PAGE_SIZE, parsePageParam, publishedOnly } from '@/lib/content'
import { buildDateRangeLabel } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'رویدادها',
    path: '/events',
    description: 'برنامه‌ها و رویدادهای هیات باقرالعلوم (ع)',
  })
}

type EventsPageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const [user, params] = await Promise.all([getSession(), searchParams])
  const page = parsePageParam(params.page)
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'events',
    where: publishedOnly,
    sort: '-startDate',
    limit: CONTENT_PAGE_SIZE,
    page,
    depth: 1,
  })

  return (
    <ContentPageShell
      user={user}
      title="رویدادها"
      description="برنامه‌ها و مناسبت‌های هیات؛ از محرم تا شب‌های شهادت و برنامه‌های ویژه."
    >
      {result.docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">هنوز رویدادی منتشر نشده است.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((event) => (
              <ContentCard
                key={event.id}
                href={`/events/${event.slug || event.id}`}
                title={event.title}
                description={event.excerpt}
                meta={buildDateRangeLabel(event.startDate, event.endDate)}
                imageUrl={resolveMediaSizeUrl(event.image, 'card')}
                imageAlt={resolveMediaAlt(event.image, event.title)}
                badge={event.location || undefined}
              />
            ))}
          </div>
          <Pagination
            page={result.page || page}
            totalPages={result.totalPages}
            basePath="/events"
            label="صفحه‌بندی رویدادها"
          />
        </>
      )}
    </ContentPageShell>
  )
}
