import type { Payload } from 'payload'
import type { Donation } from '@/payload-types'

import { isZarinpalConfigured, verifyZarinpalPayment } from '@/lib/zarinpal'
import { sendPaymentConfirmationSms } from '@/lib/sms'
import { formatTomans } from '@/lib/format'

/**
 * برای تراکنش‌های در انتظار که Authority دارند (کاربر به درگاه رفته ولی
 * callback کامل نشده) وضعیت را از زرین‌پال استعلام می‌گیرد.
 * اگر پرداخت موفق بوده باشد، وضعیت را به «موفق» تغییر می‌دهد.
 */
export async function reverifyPendingDonation(
  payload: Payload,
  donation: Donation,
): Promise<Donation> {
  if (
    donation.status !== 'pending' ||
    !donation.authority ||
    !isZarinpalConfigured()
  ) {
    return donation
  }

  try {
    const { refId } = await verifyZarinpalPayment({
      authority: donation.authority,
      amount: donation.amount,
    })

    const updated = await payload.update({
      collection: 'donations',
      id: donation.id,
      data: { status: 'success', refId: String(refId) },
      overrideAccess: true,
    })

    const donorPhone =
      typeof donation.donor === 'object' && donation.donor ? donation.donor.username : null

    if (donorPhone && donation.trackingCode) {
      await sendPaymentConfirmationSms(donorPhone, {
        amount: formatTomans(donation.amount),
        trackingCode: donation.trackingCode,
      })
    }

    return updated
  } catch {
    // پرداختی ثبت نشده؛ تراکنش همچنان در انتظار می‌ماند
    return donation
  }
}
