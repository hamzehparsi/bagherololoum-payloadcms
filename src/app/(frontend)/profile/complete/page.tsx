import { redirect } from 'next/navigation'

import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { donorNeedsProfile } from '@/lib/profile'
import { getSafeNextPath } from '@/lib/safe-redirect'
import CompleteProfileForm from './CompleteProfileForm'

type CompleteProfilePageProps = {
  searchParams: Promise<{ next?: string }>
}

export default async function CompleteProfilePage({ searchParams }: CompleteProfilePageProps) {
  const user = await getSession()
  const params = await searchParams
  const next = getSafeNextPath(params.next)

  if (!user) {
    redirect(next ? `/auth?next=${encodeURIComponent(next)}` : '/auth')
  }

  if (!donorNeedsProfile(user)) {
    redirect(next || '/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-md">
        <CompleteProfileForm />
      </div>
    </div>
  )
}
