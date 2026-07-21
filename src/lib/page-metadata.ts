import type { Metadata } from 'next'

import { buildSiteMetadata, type PageSeoInput } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'

export async function generatePageMetadata(page: PageSeoInput = {}): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildSiteMetadata(settings, page)
}
