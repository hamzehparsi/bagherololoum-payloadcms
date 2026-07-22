import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'
import { ArrowLeft } from 'lucide-react'

import ContentRichText from '@/components/content/ContentRichText'
import SiteHeader from '@/components/SiteHeader'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { findBySlug, normalizeRouteSlug } from '@/lib/find-by-slug'
import { formatJalaliDate } from '@/lib/jalali-date'
import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import type { News } from '@/payload-types'

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = normalizeRouteSlug(rawSlug)
  const payload = await getPayload({ config })
  const item = await findBySlug<News>(payload, { collection: 'news', slug: rawSlug })
  if (!item) return generatePageMetadata({ title: 'خبر', path: `/news/${slug}` })

  return generatePageMetadata({
    title: item.title,
    description: item.excerpt || undefined,
    path: `/news/${item.slug}`,
  })
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const [{ slug: rawSlug }, user] = await Promise.all([params, getSession()])
  const payload = await getPayload({ config })
  const item = await findBySlug<News>(payload, { collection: 'news', slug: rawSlug, depth: 1 })

  if (!item) notFound()

  const imageUrl = resolveMediaSizeUrl(item.featuredImage, 'hero')

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <Link
          href="/news"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
          بازگشت به اخبار
        </Link>

        <p className="text-sm text-muted-foreground">
          {formatJalaliDate(item.publishedAt || item.createdAt)}
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">{item.title}</h1>
        {item.excerpt && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {item.excerpt}
          </p>
        )}

        {imageUrl && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={imageUrl}
              alt={resolveMediaAlt(item.featuredImage, item.title)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          <ContentRichText data={item.content} />
        </div>
      </main>
    </>
  )
}
