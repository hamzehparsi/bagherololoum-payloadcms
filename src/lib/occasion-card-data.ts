import type { Occasion } from '@/payload-types'

import { formatJalaliDate } from '@/lib/jalali-date'

export function resolveOccasionImageUrl(occasion: Occasion): string | null {
  if (typeof occasion.image === 'object' && occasion.image?.url) {
    return occasion.image.url
  }
  return null
}

export function buildOccasionDateRangeLabel(occasion: Occasion): string | null {
  const start = occasion.startDate ? formatJalaliDate(occasion.startDate) : null
  const end = occasion.endDate ? formatJalaliDate(occasion.endDate) : null

  if (start && end) return `${start} تا ${end}`
  if (start) return `از ${start}`
  if (end) return `تا ${end}`
  return null
}
