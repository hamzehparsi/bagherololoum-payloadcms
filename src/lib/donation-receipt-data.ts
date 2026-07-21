import fs from 'fs'
import path from 'path'

import sharp from 'sharp'

import type { Donation, Donor, Media } from '@/payload-types'

import { formatJalaliDateTime } from '@/lib/jalali-date'
import { formatTomans } from '@/lib/format'
import { GENERAL_DONATION_TITLE } from '@/lib/payment-amounts'

export type DonationReceiptData = {
  id: number
  amountLabel: string
  statusLabel: string
  trackingCode: string
  refId: string
  occasionTitle: string
  paymentMethod: string
  createdAtLabel: string
  donorName: string
  donorPhone: string
  siteName: string
  siteUrl: string
  logoSrc: string | null
}

const statusLabels = {
  pending: 'در انتظار پرداخت',
  success: 'موفق',
  failed: 'ناموفق',
  expired: 'منقضی‌شده',
} as const

export function getDonorDisplayName(donor: Donor): string {
  const fullName = [donor.firstName, donor.lastName].filter(Boolean).join(' ').trim()
  return fullName || donor.username
}

export function getOccasionTitle(occasion: Donation['occasion']): string {
  if (typeof occasion === 'object' && occasion) return occasion.title
  if (occasion == null) return GENERAL_DONATION_TITLE
  return '—'
}

export function buildDonationReceiptData(params: {
  donation: Donation
  donor: Donor
  siteName: string
  siteUrl: string
  logoSrc: string | null
}): DonationReceiptData {
  const { donation, donor, siteName, siteUrl, logoSrc } = params

  return {
    id: donation.id,
    amountLabel: formatTomans(donation.amount),
    statusLabel: statusLabels[donation.status],
    trackingCode: donation.trackingCode || '—',
    refId: donation.refId || '—',
    occasionTitle: getOccasionTitle(donation.occasion),
    paymentMethod: donation.paymentMethod || 'درگاه پرداخت آنلاین',
    createdAtLabel: formatJalaliDateTime(donation.createdAt),
    donorName: getDonorDisplayName(donor),
    donorPhone: donor.username,
    siteName,
    siteUrl,
    logoSrc,
  }
}

function getMimeType(extension: string): string {
  switch (extension) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.webp':
      return 'image/webp'
    default:
      return 'image/png'
  }
}

export function resolveMediaFilePath(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number' || !media.filename) return null

  const candidates = [
    path.join(process.cwd(), 'media', media.filename),
    path.join(process.cwd(), 'public', media.filename),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

async function readImageAsDataUri(filePath: string): Promise<string | null> {
  try {
    const extension = path.extname(filePath).toLowerCase()

    if (extension === '.svg') {
      const pngBuffer = await sharp(filePath).png().toBuffer()
      return `data:image/png;base64,${pngBuffer.toString('base64')}`
    }

    const buffer = await fs.promises.readFile(filePath)
    return `data:${getMimeType(extension)};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}

export async function resolveLogoForPdf(
  media: number | Media | null | undefined,
  siteUrl?: string,
): Promise<string | null> {
  if (!media || typeof media === 'number') return null

  const filePath = resolveMediaFilePath(media)
  if (filePath) {
    return readImageAsDataUri(filePath)
  }

  if (media.url) {
    try {
      const base = siteUrl?.replace(/\/$/, '') || 'http://localhost:3000'
      const mediaUrl = media.url.startsWith('http') ? media.url : `${base}${media.url}`
      const response = await fetch(mediaUrl)
      if (!response.ok) return null

      const buffer = Buffer.from(await response.arrayBuffer())
      const contentType = response.headers.get('content-type') || 'image/png'
      return `data:${contentType};base64,${buffer.toString('base64')}`
    } catch {
      return null
    }
  }

  return null
}
