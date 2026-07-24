import type { Where } from 'payload'

export const publishedOnly: Where = {
  isPublished: { equals: true },
}

export const CONTENT_PAGE_SIZE = 12

export function parsePageParam(raw?: string): number {
  const page = Number(raw)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export const podcastCategoryLabels: Record<string, string> = {
  rawda: 'روضه',
  maddahi: 'مداحی',
  lecture: 'سخنرانی',
  podcast: 'پادکست',
}

export type GalleryMediaType = 'photo' | 'video'

export function galleryMediaType(gallery: {
  type?: GalleryMediaType | null
  videos?: unknown[] | null
}): GalleryMediaType {
  if (gallery.type) return gallery.type
  return (gallery.videos?.length ?? 0) > 0 ? 'video' : 'photo'
}
