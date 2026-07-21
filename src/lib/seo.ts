import type { Metadata } from 'next'
import type { Media, SiteSetting } from '@/payload-types'

export type PageSeoInput = {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}

const FALLBACK_SITE_NAME = 'هیات باقرالعلوم (ع)'
const FALLBACK_DESCRIPTION = 'سامانه پرداخت آنلاین هیات باقرالعلوم (ع)'

export function normalizeSiteUrl(raw?: string | null): string | undefined {
  if (!raw?.trim()) return undefined

  const trimmed = raw.trim().replace(/\/$/, '')
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  return `https://${trimmed}`
}

function parseKeywords(raw?: string | null): string[] | undefined {
  if (!raw?.trim()) return undefined
  const keywords = raw
    .split(/[,،]/)
    .map((item) => item.trim())
    .filter(Boolean)
  return keywords.length > 0 ? keywords : undefined
}

function resolveMediaUrl(media: number | Media | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  return media.url ?? undefined
}

function buildTitle(settings: SiteSetting, pageTitle?: string): string {
  const siteName = settings.siteName || FALLBACK_SITE_NAME

  if (!pageTitle) {
    return settings.defaultTitle || siteName
  }

  if (settings.titleTemplate?.includes('%s')) {
    return settings.titleTemplate.replace('%s', pageTitle)
  }

  return `${pageTitle} | ${siteName}`
}

export function buildSiteMetadata(
  settings: SiteSetting,
  page: PageSeoInput = {},
): Metadata {
  const siteName = settings.siteName || FALLBACK_SITE_NAME
  const siteUrl = normalizeSiteUrl(settings.siteUrl)
  const title = buildTitle(settings, page.title)
  const description =
    page.description || settings.siteDescription || settings.defaultTitle || FALLBACK_DESCRIPTION
  const keywords = parseKeywords(settings.keywords)
  const logoUrl = resolveMediaUrl(settings.siteLogo)
  // اگر تصویر Open Graph جدا تنظیم نشده باشد، از لوگوی سایت استفاده می‌شود
  const ogImageUrl = resolveMediaUrl(settings.ogImage) || logoUrl
  const canonicalPath = page.path || ''
  const noIndex = page.noIndex || settings.allowIndexing === false

  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      siteName,
      locale: 'fa_IR',
      type: 'website',
      ...(siteUrl ? { url: `${siteUrl}${canonicalPath}` } : {}),
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, alt: siteName }] } : {}),
    },
    twitter: {
      card: ogImageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
      ...(settings.twitterUsername
        ? { site: `@${settings.twitterUsername}`, creator: `@${settings.twitterUsername}` }
        : {}),
    },
  }

  if (siteUrl) {
    try {
      metadata.metadataBase = new URL(siteUrl)
      metadata.alternates = {
        canonical: `${siteUrl}${canonicalPath}`,
      }
    } catch {
      // Ignore invalid URLs from admin input; metadata still works without base URL.
    }
  }

  if (settings.googleSiteVerification) {
    metadata.verification = {
      google: settings.googleSiteVerification,
    }
  }

  if (logoUrl) {
    metadata.icons = {
      icon: logoUrl,
      apple: logoUrl,
    }
  }

  return metadata
}
