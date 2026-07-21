'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { isZarinpalConfigured, requestZarinpalPayment } from '@/lib/zarinpal'
import { sendPaymentConfirmationSms } from '@/lib/sms'
import { formatTomans } from '@/lib/format'

export async function initiatePayment(donationId: number): Promise<never> {
  const user = await getSession()
  if (!user) redirect('/auth?next=/donate/confirm')

  const payload = await getPayload({ config })

  const donation = await payload.findByID({
    collection: 'donations',
    id: donationId,
  })

  const donorId = typeof donation.donor === 'object' ? donation.donor?.id : donation.donor
  if (donorId !== user.id) {
    redirect('/donate')
  }

  if (donation.status !== 'pending') {
    redirect('/profile/donations')
  }

  if (!isZarinpalConfigured()) {
    redirect(`/donate/payment?id=${donationId}&mode=mock`)
  }

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const callbackUrl = `${protocol}://${host}/donate/callback`

  const occasionTitle =
    typeof donation.occasion === 'object' && donation.occasion
      ? donation.occasion.title
      : 'کمک مالی'

  const { authority, paymentUrl } = await requestZarinpalPayment({
    amount: donation.amount,
    description: `پرداخت ${occasionTitle}`,
    callbackUrl,
    mobile: user.username,
  })

  await payload.update({
    collection: 'donations',
    id: donation.id,
    data: { authority },
    overrideAccess: true,
  })

  redirect(paymentUrl)
}

export async function mockCompletePayment(donationId: number): Promise<{ success: boolean; error?: string }> {
  if (process.env.NODE_ENV === 'production' && isZarinpalConfigured()) {
    return { success: false, error: 'Mock payment is disabled in production.' }
  }

  const user = await getSession()
  if (!user) return { success: false, error: 'لطفاً ابتدا وارد شوید.' }

  const payload = await getPayload({ config })
  const donation = await payload.findByID({ collection: 'donations', id: donationId })
  const donorId = typeof donation.donor === 'object' ? donation.donor?.id : donation.donor

  if (donorId !== user.id) return { success: false, error: 'دسترسی غیرمجاز.' }

  await payload.update({
    collection: 'donations',
    id: donationId,
    data: { status: 'success', refId: `MOCK-${Date.now()}` },
    overrideAccess: true,
  })

  if (donation.trackingCode) {
    await sendPaymentConfirmationSms(user.username, {
      amount: formatTomans(donation.amount),
      trackingCode: donation.trackingCode,
    })
  }

  redirect('/profile/donations?payment=success')
}
