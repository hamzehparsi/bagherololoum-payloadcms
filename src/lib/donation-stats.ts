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
