import type { Where } from 'payload'

import { podcastCategoryLabels, publishedOnly } from '@/lib/content'

export type PodcastListFilters = {
  category?: string
  tag?: string
  performer?: string
  page?: number
}

export function normalizePodcastTag(raw?: string | null): string | undefined {
  if (!raw) return undefined
  const value = decodeURIComponent(raw).trim().replace(/^#+/, '')
  return value || undefined
}

export function normalizePodcastPerformer(raw?: string | null): string | undefined {
  if (!raw) return undefined
  const value = decodeURIComponent(raw).trim()
  return value || undefined
}

export function buildPodcastWhere(filters: {
  category?: string
  tag?: string
  performer?: string
}): Where {
  const clauses: Where[] = [publishedOnly]

  if (filters.category && podcastCategoryLabels[filters.category]) {
    clauses.push({ category: { equals: filters.category } })
  }

  if (filters.tag) {
    clauses.push({ 'hashtags.tag': { equals: filters.tag } })
  }

  if (filters.performer) {
    clauses.push({ performer: { equals: filters.performer } })
  }

  return clauses.length === 1 ? publishedOnly : { and: clauses }
}

export function buildPodcastsUrl(filters: PodcastListFilters = {}): string {
  const params = new URLSearchParams()

  if (filters.category && podcastCategoryLabels[filters.category]) {
    params.set('category', filters.category)
  }
  if (filters.tag) params.set('tag', filters.tag)
  if (filters.performer) params.set('performer', filters.performer)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  const qs = params.toString()
  return qs ? `/podcasts?${qs}` : '/podcasts'
}

export function podcastTagHref(tag: string): string {
  return buildPodcastsUrl({ tag: normalizePodcastTag(tag) })
}

export function podcastPerformerHref(performer: string): string {
  return buildPodcastsUrl({ performer: normalizePodcastPerformer(performer) })
}

export type PodcastHashtagItem = {
  tag: string
  id?: string | null
}

export function getPodcastHashtags(
  hashtags?: PodcastHashtagItem[] | null,
): PodcastHashtagItem[] {
  if (!hashtags?.length) return []

  return hashtags
    .map((item) => ({
      ...item,
      tag: item.tag?.trim().replace(/^#+/, '') || '',
    }))
    .filter((item) => item.tag.length > 0)
}
