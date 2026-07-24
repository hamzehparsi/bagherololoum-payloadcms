'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, FileText, Hash, Loader2, Receipt } from 'lucide-react'
import { toast } from 'sonner'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatTomans } from '@/lib/format'

export type DonationListItem = {
  id: number
  amount: number
  status: 'pending' | 'success' | 'failed' | 'expired'
  trackingCode?: string | null
  refId?: string | null
  createdAtLabel: string
  occasionTitle?: string | null
}

const statusLabels: Record<DonationListItem['status'], string> = {
  pending: 'در انتظار پرداخت',
  success: 'موفق',
  failed: 'ناموفق',
  expired: 'منقضی‌شده',
}

const statusStyles: Record<DonationListItem['status'], string> = {
  pending: 'bg-brand-green text-white',
  success: 'bg-brand-green/10 text-brand-green',
  failed: 'bg-brand-red/10 text-brand-red',
  expired: 'bg-muted text-muted-foreground',
}

async function downloadReceiptPdf(donationId: number, trackingCode?: string | null) {
  const response = await fetch(`/api/donations/${donationId}/receipt`, {
    credentials: 'include',
  })

  if (!response.ok) {
    let message = 'خطا در ساخت رسید PDF'
    try {
      const data = (await response.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  const blob = await response.blob()
  if (blob.type && !blob.type.includes('pdf')) {
    throw new Error('فایل دریافتی PDF نیست')
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `receipt-${trackingCode || donationId}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function DownloadReceiptButton({
  donationId,
  trackingCode,
}: {
  donationId: number
  trackingCode?: string | null
}) {
  const [pending, setPending] = useState(false)

  const handleDownload = async () => {
    setPending(true)
    try {
      await downloadReceiptPdf(donationId, trackingCode)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در دانلود رسید')
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleDownload}
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'gap-2 border-brand-red/20 bg-brand-red/5 rounded-full px-4 py-4 text-brand-red hover:bg-brand-red/10',
      )}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
      {pending ? 'در حال ساخت...' : 'رسید PDF'}
    </button>
  )
}

type DonationsListProps = {
  items: DonationListItem[]
  total?: number
}

export default function DonationsList({ items, total }: DonationsListProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {(total ?? items.length).toLocaleString('fa-IR')} پرداخت ثبت‌شده
      </p>

      <div className="space-y-3">
        {items.map((donation) => (
          <article
            key={donation.id}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 bg-muted/20 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-brand-red">{formatTomans(donation.amount)}</p>
                {donation.occasionTitle && (
                  <p className="mt-1 text-xs text-muted-foreground">{donation.occasionTitle}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {donation.status === 'success' && (
                  <DownloadReceiptButton
                    donationId={donation.id}
                    trackingCode={donation.trackingCode}
                  />
                )}
                {donation.status === 'pending' && (
                  <Link
                    href={`/donate/payment?id=${donation.id}`}
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'sm' }),
                      'gap-1.5 rounded-full px-4 py-4',
                    )}
                  >
                    ادامه پرداخت
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                )}
                <span
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium ${statusStyles[donation.status]}`}
                >
                  {statusLabels[donation.status]}
                </span>
              </div>
            </div>

            <div className="grid gap-3 px-5 py-4 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-xl bg-muted/30 px-3 py-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">تاریخ پرداخت</p>
                  <p className="mt-0.5 text-sm font-medium">{donation.createdAtLabel}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-muted/30 px-3 py-3">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">کد پیگیری</p>
                  <p className="mt-0.5 truncate font-mono text-sm font-medium">
                    {donation.trackingCode || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-muted/30 px-3 py-3">
                <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">کد مرجع</p>
                  <p className="mt-0.5 truncate font-mono text-sm font-medium">
                    {donation.refId || '—'}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
