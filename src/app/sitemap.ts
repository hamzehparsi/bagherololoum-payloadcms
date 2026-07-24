import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import { publishedOnly } from '@/lib/content'
import { normalizeSiteUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const siteUrl = normalizeSiteUrl(settings.siteUrl) || 'http://localhost:3000'
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/donate`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/galleries`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/podcasts`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/board`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const payload = await getPayload({ config })
    const [events, galleries, podcasts, news, pages, occasions] = await Promise.all([
      payload.find({ collection: 'events', where: publishedOnly, limit: 1000, depth: 0 }),
      payload.find({ collection: 'galleries', where: publishedOnly, limit: 1000, depth: 0 }),
      payload.find({ collection: 'podcasts', where: publishedOnly, limit: 1000, depth: 0 }),
      payload.find({ collection: 'news', where: publishedOnly, limit: 1000, depth: 0 }),
      payload.find({ collection: 'pages', where: publishedOnly, limit: 100, depth: 0 }),
      payload.find({
        collection: 'occasions',
        where: { isActive: { equals: true } },
        limit: 200,
        depth: 0,
      }),
    ])

    for (const doc of events.docs) {
      if (!doc.slug) continue
      entries.push({
        url: `${siteUrl}/events/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
    for (const doc of galleries.docs) {
      if (!doc.slug) continue
      entries.push({
        url: `${siteUrl}/galleries/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
    for (const doc of podcasts.docs) {
      if (!doc.slug) continue
      entries.push({
        url: `${siteUrl}/podcasts/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
    for (const doc of news.docs) {
      if (!doc.slug) continue
      entries.push({
        url: `${siteUrl}/news/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
    for (const doc of pages.docs) {
      if (!doc.slug) continue
      entries.push({
        url: `${siteUrl}/p/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
    for (const doc of occasions.docs) {
      entries.push({
        url: `${siteUrl}/occasions/${doc.id}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch {
    // اگر دیتابیس در دسترس نبود، حداقل صفحات ثابت برگردانده می‌شوند
  }

  return entries
}
