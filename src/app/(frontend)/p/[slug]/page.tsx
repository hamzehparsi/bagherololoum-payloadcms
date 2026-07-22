import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import config from '@payload-config'
import { getPayload } from 'payload'

import BoardMembersGrid from '@/components/content/BoardMembersGrid'
import ContentRichText from '@/components/content/ContentRichText'
import SiteHeader from '@/components/SiteHeader'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { findBySlug, normalizeRouteSlug } from '@/lib/find-by-slug'
import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'
import { generatePageMetadata } from '@/lib/page-metadata'
import type { Page } from '@/payload-types'

type StaticPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: StaticPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = normalizeRouteSlug(rawSlug)
  const payload = await getPayload({ config })
  const page = await findBySlug<Page>(payload, { collection: 'pages', slug: rawSlug })
  if (!page) return generatePageMetadata({ title: 'صفحه', path: `/p/${slug}` })

  return generatePageMetadata({
    title: page.title,
    description: page.excerpt || undefined,
    path: `/p/${page.slug}`,
  })
}

export default async function StaticPage({ params }: StaticPageProps) {
  const [{ slug: rawSlug }, user] = await Promise.all([params, getSession()])
  const payload = await getPayload({ config })
  const page = await findBySlug<Page>(payload, { collection: 'pages', slug: rawSlug, depth: 1 })

  if (!page) notFound()

  const imageUrl = resolveMediaSizeUrl(page.image, 'hero')

  const members = page.showBoardMembers
    ? (
        await payload.find({
          collection: 'board-members',
          sort: 'order',
          limit: 100,
          depth: 1,
        })
      ).docs
    : []

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        {imageUrl && (
          <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={imageUrl}
              alt={resolveMediaAlt(page.image, page.title)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-2xl font-black sm:text-3xl">{page.title}</h1>
        {page.excerpt && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {page.excerpt}
          </p>
        )}

        <div className="mt-8">
          <ContentRichText data={page.content} />
        </div>

        {page.showBoardMembers && <BoardMembersGrid members={members} />}
      </main>
    </>
  )
}
