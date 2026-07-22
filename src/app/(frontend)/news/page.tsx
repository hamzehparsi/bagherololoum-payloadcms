import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import ContentCard from '@/components/content/ContentCard'
import ContentPageShell from '@/components/content/ContentPageShell'
import Pagination from '@/components/content/Pagination'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { CONTENT_PAGE_SIZE, parsePageParam, publishedOnly } from '@/lib/content'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'اخبار',
    path: '/news',
    description: 'اخبار و اطلاعیه‌های هیات باقرالعلوم (ع)',
  })
}

type NewsPageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const [user, params] = await Promise.all([getSession(), searchParams])
  const page = parsePageParam(params.page)
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'news',
    where: publishedOnly,
    sort: '-publishedAt',
    limit: CONTENT_PAGE_SIZE,
    page,
    depth: 1,
  })

  return (
    <ContentPageShell
      user={user}
      title="اخبار"
      description="آخرین اخبار، اطلاعیه‌ها و گزارش‌های هیات."
    >
      {result.docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">هنوز خبری منتشر نشده است.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((item) => (
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
          <Pagination
            page={result.page || page}
            totalPages={result.totalPages}
            basePath="/news"
            label="صفحه‌بندی اخبار"
          />
        </>
      )}
    </ContentPageShell>
  )
}
