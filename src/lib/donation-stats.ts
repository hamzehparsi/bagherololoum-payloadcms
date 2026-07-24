import type { Payload } from 'payload'

export type DonationStats = {
  /** جمع کل کمک‌های موفق (تومان) */
  totalRaised: number
  /** تعداد پرداخت‌های موفق */
  successCount: number
  /** جمع کمک‌های موفق به تفکیک مناسبت */
  raisedByOccasion: Record<number, number>
  /** جمع کمک‌های عمومی (بدون مناسبت) */
  generalRaised: number
}

export type ReferrerStat = {
  id: number
  name: string
  role?: string | null
  amount: number
  count: number
}

export async function getDonationStats(payload: Payload): Promise<DonationStats> {
  const result = await payload.find({
    collection: 'donations',
    where: { status: { equals: 'success' } },
    limit: 10000,
    depth: 0,
    select: { amount: true, occasion: true },
    overrideAccess: true,
  })

  const stats: DonationStats = {
    totalRaised: 0,
    successCount: result.totalDocs,
    raisedByOccasion: {},
    generalRaised: 0,
  }

  for (const donation of result.docs) {
    stats.totalRaised += donation.amount

    const occasionId =
      typeof donation.occasion === 'object' ? donation.occasion?.id : donation.occasion

    if (occasionId) {
      stats.raisedByOccasion[occasionId] = (stats.raisedByOccasion[occasionId] || 0) + donation.amount
    } else {
      stats.generalRaised += donation.amount
    }
  }

  return stats
}

/** آمار معرف‌های حمایت عمومی در بازه زمانی (پیش‌فرض: ماه جاری) */
export async function getReferrerStats(
  payload: Payload,
  options?: { from?: Date; to?: Date },
): Promise<ReferrerStat[]> {
  const now = new Date()
  const from = options?.from ?? new Date(now.getFullYear(), now.getMonth(), 1)
  const to = options?.to ?? now

  const result = await payload.find({
    collection: 'donations',
    where: {
      and: [
        { status: { equals: 'success' } },
        { referredBy: { exists: true } },
        { createdAt: { greater_than_equal: from.toISOString() } },
        { createdAt: { less_than_equal: to.toISOString() } },
      ],
    },
    limit: 10000,
    depth: 1,
    select: { amount: true, referredBy: true },
    overrideAccess: true,
  })

  const byReferrer = new Map<number, ReferrerStat>()

  for (const donation of result.docs) {
    const referrer =
      typeof donation.referredBy === 'object' && donation.referredBy
        ? donation.referredBy
        : null
    if (!referrer) continue

    const current = byReferrer.get(referrer.id) || {
      id: referrer.id,
      name: referrer.name,
      role: referrer.role,
      amount: 0,
      count: 0,
    }
    current.amount += donation.amount
    current.count += 1
    byReferrer.set(referrer.id, current)
  }

  return Array.from(byReferrer.values()).sort((a, b) => b.amount - a.amount)
}
