import type { Media } from '@/payload-types'

export function resolveMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

export function resolveMediaAlt(media: number | Media | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

type MediaSize = 'thumbnail' | 'card' | 'hero'

export function resolveMediaSizeUrl(
  media: number | Media | null | undefined,
  size: MediaSize,
): string | null {
  if (!media || typeof media === 'number') return null
  return media.sizes?.[size]?.url || media.url || null
}
