import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft, HandCoins, ReceiptText } from 'lucide-react'

import SiteHeader from '@/components/SiteHeader'
import ProfileAvatarUploader from '@/components/profile/ProfileAvatarUploader'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { generatePageMetadata } from '@/lib/page-metadata'
import { getDonorDisplayName, donorNeedsProfile } from '@/lib/profile'
import { resolveDonorAvatarUrl } from '@/lib/media'

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

  const displayName = getDonorDisplayName(user)
  const avatarUrl = resolveDonorAvatarUrl(user.avatar, user.avatarPreset)
  const hasCustomAvatar = Boolean(user.avatar)

  return (
    <>
      <SiteHeader user={user} />
      <div className="mx-auto max-w-4xl p-6 sm:p-8">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="mb-8 text-xl font-bold">پروفایل من</h1>

          <div className="mb-8 border-b border-border pb-8">
            <ProfileAvatarUploader
              currentUrl={avatarUrl}
              currentPreset={user.avatarPreset}
              hasCustomAvatar={hasCustomAvatar}
              displayName={displayName}
            />
          </div>

          <div className="divide-y divide-border/70">
            <div className="flex items-center justify-between gap-4 py-4">
              <p className="text-sm text-muted-foreground">نام</p>
              <p className="text-base font-medium">{user.firstName || '—'}</p>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <p className="text-sm text-muted-foreground">نام خانوادگی</p>
              <p className="text-base font-medium">{user.lastName || '—'}</p>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <p className="text-sm text-muted-foreground">شماره موبایل</p>
              <p className="text-base font-medium" dir="ltr">
                {user.username}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/profile/donations"
              className="group flex items-center gap-3 rounded-xl border border-brand-red/15 bg-brand-red/[0.04] p-4 transition-all hover:border-brand-red/30 hover:bg-brand-red/[0.08]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                <ReceiptText className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-brand-red">پرداخت‌های من</span>
                <span className="block text-xs text-muted-foreground">
                  تاریخچه و رسید پرداخت‌ها
                </span>
              </span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-brand-red/50 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <Link
              href="/donate"
              className="group flex items-center gap-3 rounded-xl border border-brand-green/15 bg-brand-green/[0.04] p-4 transition-all hover:border-brand-green/30 hover:bg-brand-green/[0.08]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <HandCoins className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-brand-green">مشارکت مالی</span>
                <span className="block text-xs text-muted-foreground">
                  کمک به مناسبت‌ها و برنامه‌های هیات
                </span>
              </span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-brand-green/50 transition-transform group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
