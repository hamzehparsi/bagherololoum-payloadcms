import config from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

import { verifyZarinpalPayment } from '@/lib/zarinpal'
import { sendPaymentConfirmationSms } from '@/lib/sms'
import { formatTomans } from '@/lib/format'

export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get('Authority')
  const status = request.nextUrl.searchParams.get('Status')
  const origin = request.nextUrl.origin

  if (!authority || status !== 'OK') {
    return NextResponse.redirect(`${origin}/profile/donations?payment=failed`)
  }

  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'donations',
      where: { authority: { equals: authority } },
      limit: 1,
      depth: 1,
    })

    if (!result.docs.length) {
      return NextResponse.redirect(`${origin}/profile/donations?payment=failed`)
    }

    const donation = result.docs[0]

    const { refId } = await verifyZarinpalPayment({
      authority,
      amount: donation.amount,
    })

    await payload.update({
      collection: 'donations',
      id: donation.id,
      data: {
        status: 'success',
        refId: String(refId),
      },
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

    return NextResponse.redirect(`${origin}/profile/donations?payment=success`)
  } catch (err) {
    console.error('payment callback error:', err)
    return NextResponse.redirect(`${origin}/profile/donations?payment=failed`)
  }
}
