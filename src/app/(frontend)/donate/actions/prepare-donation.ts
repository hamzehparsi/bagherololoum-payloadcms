'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'

import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { setPendingDonation } from '@/lib/pending-donation'
import { appendNextParam } from '@/lib/safe-redirect'
import { GENERAL_DONATION_TITLE } from '@/lib/payment-amounts'

export type PrepareDonationResult = {
  success: boolean
  error?: string
  redirectTo?: string
}

export async function prepareDonation(
  occasionId: number | null,
  amount: number,
  referredById: number | null = null,
): Promise<PrepareDonationResult> {
  if (!amount || amount <= 0) {
    return { success: false, error: 'مبلغ نامعتبر است.' }
  }

  try {
    const payload = await getPayload({ config })
    const paymentSettings = await payload.findGlobal({ slug: 'payment-settings' })
    const minAmount = paymentSettings.minCustomAmount ?? 10000

    let occasionTitle = GENERAL_DONATION_TITLE
    let isFixedAmount = false
    let resolvedReferrerId: number | null = null
    let resolvedReferrerName: string | null = null

    if (occasionId) {
      const occasion = await payload.findByID({
        collection: 'occasions',
        id: occasionId,
      })

      if (!occasion.isActive) {
        return { success: false, error: 'این مناسبت فعال نیست.' }
      }

      occasionTitle = occasion.title

      if (occasion.isFixedAmount && occasion.fixedAmount != null) {
        if (amount !== occasion.fixedAmount) {
          return { success: false, error: 'مبلغ این مناسبت ثابت است و قابل تغییر نیست.' }
        }
        isFixedAmount = true
      } else if (amount < minAmount) {
        return {
          success: false,
          error: `حداقل مبلغ ${minAmount.toLocaleString('fa-IR')} تومان است.`,
        }
      }
    } else {
      if (amount < minAmount) {
        return {
          success: false,
          error: `حداقل مبلغ ${minAmount.toLocaleString('fa-IR')} تومان است.`,
        }
      }

      if (referredById) {
        try {
          const member = await payload.findByID({
            collection: 'board-members',
            id: referredById,
          })
          resolvedReferrerId = member.id
          resolvedReferrerName = member.name
        } catch {
          return { success: false, error: 'عضو هیات امنای انتخاب‌شده معتبر نیست.' }
        }
      }
    }

    await setPendingDonation({
      occasionId,
      occasionTitle,
      amount,
      isFixedAmount,
      referredById: resolvedReferrerId,
      referredByName: resolvedReferrerName,
    })

    const user = await getSession()

    if (user) {
      redirect('/donate/confirm')
    }

    redirect(appendNextParam('/auth', '/donate/confirm'))
  } catch (err) {
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
    console.error('prepareDonation error:', err)
    return { success: false, error: 'خطایی رخ داد. دوباره تلاش کنید.' }
  }
}
