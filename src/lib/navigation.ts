import { cache } from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'

import type { Navigation, Page } from '@/payload-types'

const defaultNavigation: Navigation = {
  id: 0,
  headerItems: [
    { label: 'رویدادها', href: '/events', openInNewTab: false, id: '1' },
    { label: 'چندرسانه‌ای', href: '/galleries', openInNewTab: false, id: '2' },
    { label: 'روضه و پادکست', href: '/podcasts', openInNewTab: false, id: '3' },
    { label: 'اخبار', href: '/news', openInNewTab: false, id: '4' },
    { label: 'کمک مالی', href: '/donate', openInNewTab: false, id: '5' },
  ],
  aboutMenuItems: [
    {
      label: 'هیات امنا',
      linkType: 'custom',
      href: '/board',
      openInNewTab: false,
      id: '1',
    },
  ],
  footerLinks: [{ label: 'کمک مالی', href: '/donate', openInNewTab: false, id: '1' }],
  socialLinks: [],
  copyrightText: '© هیات باقرالعلوم (ع) — تمامی حقوق محفوظ است.',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const getNavigation = cache(async (): Promise<Navigation> => {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({
      slug: 'navigation',
      depth: 1,
    })
  } catch {
    return defaultNavigation
  }
})

export type NavLinkItem = {
  label: string
  href: string
  openInNewTab?: boolean | null
  id?: string | null
}

type AboutMenuRawItem = NonNullable<Navigation['aboutMenuItems']>[number]

export function resolveAboutMenuItems(
  items?: Navigation['aboutMenuItems'] | null,
): NavLinkItem[] {
  if (!items?.length) {
    return [{ id: 'board', label: 'هیات امنا', href: '/board', openInNewTab: false }]
  }

  return items
    .map((item, index) => resolveAboutMenuItem(item, index))
    .filter((item): item is NavLinkItem => item !== null)
}

function resolveAboutMenuItem(item: AboutMenuRawItem, index: number): NavLinkItem | null {
  const openInNewTab = Boolean(item.openInNewTab)
  const id = item.id || `about-${index}`

  if (item.linkType === 'page') {
    const page = typeof item.page === 'object' && item.page ? (item.page as Page) : null
    if (!page?.slug) return null
    return {
      id,
      label: item.label || page.title,
      href: `/p/${page.slug}`,
      openInNewTab,
    }
  }

  const href = item.href?.trim()
  if (!href) return null

  return {
    id,
    label: item.label,
    href,
    openInNewTab,
  }
}

/** لینک خارجی معتبر برمی‌گرداند؛ متن بدون پروتکل را به https تبدیل می‌کند. */
export function resolveExternalHref(value?: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`

  // دامنه یا شورت‌لینک بدون پروتکل (مثل maps.app.goo.gl/...)
  if (/^([\w-]+\.)+[\w-]+(\/|$)/i.test(trimmed)) {
    return `https://${trimmed}`
  }

  return null
}

/**
 * لینک نقشه برای فوتر.
 * اگر URL معتبر باشد همان را می‌دهد؛ اگر متن آدرس باشد جستجوی گوگل‌مپ می‌سازد.
 */
export function resolveMapHref(
  mapUrl?: string | null,
  address?: string | null,
): string | null {
  const fromUrl = resolveExternalHref(mapUrl)
  if (fromUrl) return fromUrl

  const query = mapUrl?.trim() || address?.trim()
  if (!query) return null

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
