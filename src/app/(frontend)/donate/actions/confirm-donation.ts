'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import {
  clearPendingDonation,
  getPendingDonation,
} from '@/lib/pending-donation'

export type ConfirmDonationResult = {
  success: boolean
  error?: string
  donationId?: number
}

export async function confirmDonation(): Promise<ConfirmDonationResult> {
  const user = await getSession()
  if (!user) {
    return { success: false, error: 'لطفاً ابتدا وارد شوید.' }
  }

  const pending = await getPendingDonation()
  if (!pending) {
    return { success: false, error: 'اطلاعات پرداخت یافت نشد. لطفاً دوباره انتخاب کنید.' }
  }

  try {
    const payload = await getPayload({ config })

    if (pending.occasionId) {
      const occasion = await payload.findByID({
        collection: 'occasions',
        id: pending.occasionId,
      })

      if (!occasion.isActive) {
        await clearPendingDonation()
        return { success: false, error: 'این مناسبت دیگر فعال نیست.' }
      }

      if (
        occasion.isFixedAmount &&
        occasion.fixedAmount != null &&
        pending.amount !== occasion.fixedAmount
      ) {
        return { success: false, error: 'مبلغ با مناسبت انتخاب‌شده همخوانی ندارد.' }
      }
    }

    const donation = await payload.create({
      collection: 'donations',
      data: {
        donor: user.id,
        occasion: pending.occasionId ?? undefined,
        referredBy:
          !pending.occasionId && pending.referredById ? pending.referredById : undefined,
        amount: pending.amount,
        status: 'pending',
        paymentMethod: 'zarinpal',
      },
      overrideAccess: true,
    })

    await clearPendingDonation()
    redirect(`/donate/payment?id=${donation.id}`)
  } catch (err) {
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
    console.error('confirmDonation error:', err)
    return { success: false, error: 'خطایی رخ داد. دوباره تلاش کنید.' }
  }
}
