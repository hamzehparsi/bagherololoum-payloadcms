export function extractSuggestedAmounts(
  items?: { amount?: number | null }[] | null,
): number[] {
  if (!items?.length) return []

  return items
    .map((item) => item.amount)
    .filter((amount): amount is number => typeof amount === 'number' && amount > 0)
}

export const DEFAULT_SUGGESTED_AMOUNTS = [200000, 300000, 500000, 1000000]

export function resolveSuggestedAmounts(
  items?: { amount?: number | null }[] | null,
  fallback: number[] = DEFAULT_SUGGESTED_AMOUNTS,
): number[] {
  const extracted = extractSuggestedAmounts(items)
  return extracted.length > 0 ? extracted : fallback
}

export const GENERAL_DONATION_TITLE = 'حمایت از امور عمومی هیئت'

export const GENERAL_DONATION_DESCRIPTION =
  'این کمک در راستای تأمین هزینه‌های جاری و برنامه‌های هیئت باقرالعلوم (ع) مصرف می‌شود.'

export type DonationTarget = 'general' | number
