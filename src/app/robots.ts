import type { MetadataRoute } from 'next'

import { normalizeSiteUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()
  const siteUrl = normalizeSiteUrl(settings.siteUrl)

  if (settings.allowIndexing === false) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/profile', '/auth', '/donate/payment', '/donate/callback'],
    },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  }
}
