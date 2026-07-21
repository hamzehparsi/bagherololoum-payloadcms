import type { Donation, Donor } from '@/payload-types'

import { formatJalaliDateTime } from '@/lib/jalali-date'
import { GENERAL_DONATION_TITLE } from '@/lib/payment-amounts'
import { getDonorDisplayName, getOccasionTitle } from '@/lib/donation-receipt-data'

const statusLabels = {
  pending: 'در انتظار پرداخت',
  success: 'موفق',
  failed: 'ناموفق',
  expired: 'منقضی‌شده',
} as const

export function buildDonationsCsvRows(
  donations: Array<
    Donation & {
      donor?: number | Donor
      occasion?: Donation['occasion']
    }
  >,
): string {
  const headers = [
    'شناسه',
    'تاریخ',
    'مبلغ (تومان)',
    'وضعیت',
    'نام کمک‌کننده',
    'موبایل',
    'موضوع',
    'کد پیگیری',
    'کد مرجع',
    'روش پرداخت',
  ]

  const rows = donations.map((donation) => {
    const donor =
      typeof donation.donor === 'object' && donation.donor ? donation.donor : null

    return [
      String(donation.id),
      formatJalaliDateTime(donation.createdAt),
      String(donation.amount),
      statusLabels[donation.status],
      donor ? getDonorDisplayName(donor) : '—',
      donor?.username || '—',
      getOccasionTitle(donation.occasion),
      donation.trackingCode || '—',
      donation.refId || '—',
      donation.paymentMethod || '—',
    ]
  })

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

export function buildDonationsCsv(
  donations: Array<
    Donation & {
      donor?: number | Donor
      occasion?: Donation['occasion']
    }
  >,
): string {
  return `\uFEFF${buildDonationsCsvRows(donations)}`
}
