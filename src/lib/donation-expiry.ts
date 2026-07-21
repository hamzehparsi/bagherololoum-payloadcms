import type { Payload, Where } from 'payload'

/** پرداخت‌های در انتظارِ قدیمی‌تر از این مدت، منقضی می‌شوند */
export const PENDING_DONATION_TTL_HOURS = 24

export async function expireStalePendingDonations(
  payload: Payload,
  donorId?: number,
): Promise<void> {
  const cutoff = new Date(
    Date.now() - PENDING_DONATION_TTL_HOURS * 60 * 60 * 1000,
  ).toISOString()

  const conditions: Where[] = [
    { status: { equals: 'pending' } },
    { createdAt: { less_than: cutoff } },
  ]

  if (donorId) {
    conditions.push({ donor: { equals: donorId } })
  }

  try {
    await payload.update({
      collection: 'donations',
      where: { and: conditions },
      data: { status: 'expired' },
      overrideAccess: true,
    })
  } catch (err) {
    // انقضا نباید جریان اصلی را متوقف کند
    console.error('expireStalePendingDonations error:', err)
  }
}
