import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CreditCard, ShieldCheck } from 'lucide-react'

import SiteHeader from '@/components/SiteHeader'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { formatTomans } from '@/lib/format'
import { isZarinpalConfigured } from '@/lib/zarinpal'
import { reverifyPendingDonation } from '@/lib/donation-reverify'
import { generatePageMetadata } from '@/lib/page-metadata'
import MockPaymentButton from './MockPaymentButton'
import PayWithZarinpalButton from './PayWithZarinpalButton'
import config from '@payload-config'
import { getPayload } from 'payload'

type PaymentPageProps = {
  searchParams: Promise<{ id?: string }>
}

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'درگاه پرداخت',
    path: '/donate/payment',
    noIndex: true,
  })
}

export default async function DonatePaymentPage({ searchParams }: PaymentPageProps) {
  const user = await getSession()
  if (!user) redirect('/auth?next=/donate/confirm')

  const params = await searchParams
  const donationId = Number(params.id)
  if (!donationId) redirect('/donate')

  const payload = await getPayload({ config })
  let donation = await payload.findByID({ collection: 'donations', id: donationId, depth: 1 })
  const donorId = typeof donation.donor === 'object' ? donation.donor?.id : donation.donor

  if (donorId !== user.id) redirect('/donate')

  // اگر کاربر قبلاً به درگاه رفته ولی callback کامل نشده، از زرین‌پال استعلام بگیر
  donation = await reverifyPendingDonation(payload, donation)

  if (donation.status === 'success') {
    redirect('/profile/donations?payment=success')
  }

  if (donation.status === 'expired') {
    redirect('/profile/donations')
  }

  const occasionTitle =
    typeof donation.occasion === 'object' && donation.occasion
      ? donation.occasion.title
      : 'کمک مالی'

  const zarinpalReady = isZarinpalConfigured()

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">درگاه پرداخت</h1>
              <p className="text-sm text-muted-foreground">
                {zarinpalReady ? 'انتقال امن به بانک' : 'حالت تست (بدون درگاه واقعی)'}
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">مناسبت</span>
              <span className="font-medium">{occasionTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">مبلغ</span>
              <span className="font-bold text-brand-red">{formatTomans(donation.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">کد پیگیری</span>
              <span>{donation.trackingCode || '—'}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {zarinpalReady ? (
              <PayWithZarinpalButton donationId={donationId} />
            ) : (
              <>
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    ZARINPAL_MERCHANT_ID تنظیم نشده. برای تست می‌توانید پرداخت موفق را شبیه‌سازی
                    کنید.
                  </p>
                </div>
                <MockPaymentButton donationId={donationId} />
              </>
            )}
            <Link
              href="/donate"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-full inline-flex')}
            >
              بازگشت
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
