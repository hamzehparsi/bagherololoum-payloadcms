import type { CollectionSlug, Payload, Where } from 'payload'

import { publishedOnly } from '@/lib/content'

type FindBySlugOptions = {
  collection: CollectionSlug
  slug: string
  depth?: number
  /** اگر true باشد فقط اسناد منتشرشده برگردانده می‌شوند */
  published?: boolean
}

/**
 * پیدا کردن سند با slug از URL.
 * در Next.js گاهی پارامتر dynamic برای کاراکترهای فارسی هنوز URL-encoded است.
 */
export async function findBySlug<T = unknown>(
  payload: Payload,
  { collection, slug: rawSlug, depth = 1, published = true }: FindBySlugOptions,
): Promise<T | null> {
  let slug = (rawSlug || '').trim()
  try {
    slug = decodeURIComponent(slug)
  } catch {
    // اگر قبلاً decode شده باشد، همان مقدار استفاده می‌شود
  }
  slug = slug.trim()
  if (!slug) return null

  const conditions: Where[] = []
  if (published) conditions.push(publishedOnly)

  if (/^\d+$/.test(slug)) {
    conditions.push({ id: { equals: Number(slug) } })
  } else {
    conditions.push({ slug: { equals: slug } })
  }

  const result = await payload.find({
    collection,
    where: conditions.length === 1 ? conditions[0]! : { and: conditions },
    limit: 1,
    depth,
  })

  return (result.docs[0] as T) || null
}

/** اسلاگ دریافت‌شده از params را برای استفاده در URL/metadata نرمال می‌کند */
export function normalizeRouteSlug(rawSlug: string | undefined): string {
  if (!rawSlug) return ''
  try {
    return decodeURIComponent(rawSlug).trim()
  } catch {
    return rawSlug.trim()
  }
}
