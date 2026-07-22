import config from '@payload-config'
import { getPayload } from 'payload'

import SiteFooter from '@/components/SiteFooter'
import { publishedOnly } from '@/lib/content'
import { getNavigation } from '@/lib/navigation'
import { getSiteSettings } from '@/lib/site-settings'

export default async function SiteFooterServer() {
  const [navigation, settings, payload] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
    getPayload({ config }),
  ])

  const pagesResult = await payload.find({
    collection: 'pages',
    where: publishedOnly,
    sort: 'title',
    limit: 50,
    depth: 0,
  })

  const pages = pagesResult.docs
    .filter((page) => page.slug)
    .map((page) => ({
      title: page.title,
      href: `/p/${page.slug}`,
    }))

  return (
    <SiteFooter
      navigation={navigation}
      siteName={settings.siteName || 'هیات باقرالعلوم (ع)'}
      pages={pages}
    />
  )
}
