import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, CreditCard } from 'lucide-react'

import SiteHeader from '@/components/SiteHeader'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { getPendingDonation } from '@/lib/pending-donation'
import { formatTomans } from '@/lib/format'
import { donorNeedsProfile } from '@/lib/profile'
import { appendNextParam } from '@/lib/safe-redirect'
import { generatePageMetadata } from '@/lib/page-metadata'
import ConfirmDonationButton from './ConfirmDonationButton'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'تأیید پرداخت',
    path: '/donate/confirm',
    noIndex: true,
  })
}

export default async function DonateConfirmPage() {
  const user = await getSession()
  const pending = await getPendingDonation()

  if (!user) {
    redirect(appendNextParam('/auth', '/donate/confirm'))
  }

  if (donorNeedsProfile(user)) {
    redirect(appendNextParam('/profile/complete', '/donate/confirm'))
  }

  if (!pending) {
    redirect('/donate')
  }

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-10">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">تأیید مبلغ پرداخت</h1>
              <p className="text-sm text-muted-foreground">
                اطلاعات را بررسی و پرداخت را شروع کنید
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">مناسبت</span>
              <span className="font-medium">{pending.occasionTitle}</span>
            </div>
            {pending.referredByName && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">معرف</span>
                <span className="font-medium">{pending.referredByName}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">مبلغ</span>
              <span className="text-base font-bold text-brand-red">{formatTomans(pending.amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">پرداخت‌کننده</span>
              <span className="font-medium">{user.username}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <ConfirmDonationButton />
            <Link
              href="/donate"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-full inline-flex')}
            >
              ویرایش انتخاب
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
