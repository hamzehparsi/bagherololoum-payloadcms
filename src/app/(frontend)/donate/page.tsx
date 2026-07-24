import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import SiteHeader from '@/components/SiteHeader'
import { generatePageMetadata } from '@/lib/page-metadata'
import DonateForm from '@/components/donate/DonateForm'
import type { DonateOccasionOption } from '@/components/donate/AmountSelector'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { resolveSuggestedAmounts, type DonationTarget } from '@/lib/payment-amounts'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'مشارکت مالی',
    description: 'انتخاب مناسبت و مبلغ کمک مالی به هیئت باقرالعلوم (ع)',
    path: '/donate',
  })
}

type DonatePageProps = {
  searchParams: Promise<{ occasion?: string }>
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const user = await getSession()
  const payload = await getPayload({ config })
  const params = await searchParams

  const [occasionsResult, boardMembersResult, paymentSettings] = await Promise.all([
    payload.find({
      collection: 'occasions',
      where: { isActive: { equals: true } },
      limit: 100,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'board-members',
      sort: 'order',
      limit: 100,
      depth: 0,
    }),
    payload.findGlobal({ slug: 'payment-settings' }),
  ])

  const globalSuggestedAmounts = resolveSuggestedAmounts(paymentSettings.suggestedAmounts)

  const occasions: DonateOccasionOption[] = occasionsResult.docs.map((occasion) => ({
    id: occasion.id,
    title: occasion.title,
    description: occasion.description,
    isFixedAmount: occasion.isFixedAmount,
    fixedAmount: occasion.fixedAmount,
  }))

  const boardMembers = boardMembersResult.docs.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
  }))

  let initialTarget: DonationTarget | null = null
  if (params.occasion === 'general') {
    initialTarget = 'general'
  } else {
    const occasionId = Number(params.occasion)
    if (occasionId && occasions.some((item) => item.id === occasionId)) {
      initialTarget = occasionId
    }
  }

  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <DonateForm
          occasions={occasions}
          boardMembers={boardMembers}
          globalSuggestedAmounts={globalSuggestedAmounts}
          minCustomAmount={paymentSettings.minCustomAmount ?? 10000}
          isLoggedIn={Boolean(user)}
          initialTarget={initialTarget}
        />
      </main>
    </>
  )
}
