import { cookies } from 'next/headers'

export const PENDING_DONATION_COOKIE = 'pending-donation'

export type PendingDonation = {
  occasionId: number | null
  occasionTitle: string
  amount: number
  isFixedAmount: boolean
  /** فقط برای حمایت عمومی — شناسه عضو هیات امنا */
  referredById?: number | null
  referredByName?: string | null
}

export const pendingDonationCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60,
}

export async function setPendingDonation(data: PendingDonation): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(PENDING_DONATION_COOKIE, JSON.stringify(data), pendingDonationCookieOptions)
}

export async function getPendingDonation(): Promise<PendingDonation | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(PENDING_DONATION_COOKIE)?.value
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as PendingDonation
    if (typeof parsed.amount !== 'number' || parsed.amount <= 0) return null
    if (typeof parsed.occasionTitle !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

export async function clearPendingDonation(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(PENDING_DONATION_COOKIE)
}
