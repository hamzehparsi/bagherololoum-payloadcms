import Link from 'next/link'
import { redirect } from 'next/navigation'

import SiteHeader from '@/components/SiteHeader'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { generatePageMetadata } from '@/lib/page-metadata'
import { donorNeedsProfile } from '@/lib/profile'

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'پروفایل',
    path: '/profile',
    noIndex: true,
  })
}

export default async function ProfilePage() {
  const user = await getSession()

  if (!user) {
    redirect('/auth')
  }

  if (donorNeedsProfile(user)) {
    redirect('/profile/complete')
  }

  return (
    <>
      <SiteHeader user={user} />
      <div className="mx-auto max-w-4xl p-6 sm:p-8">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="mb-8 text-xl font-bold">پروفایل من</h1>

          <div className="space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">نام</p>
              <p className="text-base font-medium">{user.firstName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">نام خانوادگی</p>
              <p className="text-base font-medium">{user.lastName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">شماره موبایل</p>
              <p className="text-base font-medium">{user.username}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/profile/donations" className="font-medium text-primary hover:underline">
              مشاهده پرداخت‌های من
            </Link>
            <Link href="/donate" className="font-medium text-primary hover:underline">
              مشارکت مالی
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
