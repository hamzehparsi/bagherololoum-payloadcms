import { cache } from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'

import type { SiteSetting } from '@/payload-types'

const defaultSiteSettings: SiteSetting = {
  id: 0,
  siteName: 'هیات باقرالعلوم (ع)',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  siteDescription: 'سامانه پرداخت آنلاین',
  defaultTitle: 'هیات باقرالعلوم (ع)',
  titleTemplate: '%s | هیات باقرالعلوم (ع)',
  allowIndexing: true,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
  } catch {
    return defaultSiteSettings
  }
})
