import type { Occasion } from '@/payload-types'

import { buildDateRangeLabel } from '@/lib/jalali-date'
import { resolveMediaUrl } from '@/lib/media'

export function resolveOccasionImageUrl(occasion: Occasion): string | null {
  return resolveMediaUrl(occasion.image)
}

export function buildOccasionDateRangeLabel(occasion: Occasion): string | null {
  return buildDateRangeLabel(occasion.startDate, occasion.endDate)
}
