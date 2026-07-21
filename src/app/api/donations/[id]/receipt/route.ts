import config from '@payload-config'
import { getPayload } from 'payload'

import { getDonorTokenFromCookies } from '@/lib/auth-cookie'
import {
  buildDonationReceiptData,
  resolveLogoForPdf,
} from '@/lib/donation-receipt-data'
import { generateDonationReceiptPdf } from '@/lib/generate-donation-receipt-pdf'
import { normalizeSiteUrl } from '@/lib/seo'
import { getSiteSettings } from '@/lib/site-settings'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const token = await getDonorTokenFromCookies()
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const donationId = Number((await context.params).id)
    if (!donationId) {
      return Response.json({ error: 'Invalid donation id' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    let donorId: number | null = null
    try {
      const { user } = await payload.auth({
        headers: new Headers({ Authorization: `JWT ${token}` }),
      })

      if (user?.collection !== 'donors') {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      donorId = user.id
    } catch {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const donation = await payload.findByID({
      collection: 'donations',
      id: donationId,
      depth: 1,
    })

    const donationDonorId =
      typeof donation.donor === 'object' ? donation.donor?.id : donation.donor

    if (donationDonorId !== donorId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (donation.status !== 'success') {
      return Response.json(
        { error: 'Receipt is only available for successful payments' },
        { status: 400 },
      )
    }

    const siteSettings = await getSiteSettings()
    const donor =
      typeof donation.donor === 'object' && donation.donor
        ? donation.donor
        : await payload.findByID({ collection: 'donors', id: donationDonorId })

    const logoMedia = siteSettings.siteLogo ?? siteSettings.ogImage
    const siteUrl = normalizeSiteUrl(siteSettings.siteUrl) || siteSettings.siteUrl
    const receiptData = buildDonationReceiptData({
      donation,
      donor,
      siteName: siteSettings.siteName,
      siteUrl,
      logoSrc: await resolveLogoForPdf(logoMedia, siteUrl),
    })

    const pdfBuffer = await generateDonationReceiptPdf(receiptData)
    const filename = `receipt-${donation.trackingCode || donation.id}.pdf`

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Receipt PDF error:', error)
    return Response.json({ error: 'Failed to generate receipt PDF' }, { status: 500 })
  }
}
