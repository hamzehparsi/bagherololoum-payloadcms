import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'

import BoardMembersGrid from '@/components/content/BoardMembersGrid'
import ContentPageShell from '@/components/content/ContentPageShell'
import { getSession } from '@/app/(frontend)/auth/actions/get-session'
import { generatePageMetadata } from '@/lib/page-metadata'

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'هیات امنا',
    path: '/board',
    description: 'معرفی اعضای هیات امنای هیات باقرالعلوم (ع)',
  })
}

export default async function BoardPage() {
  const [user, payload] = await Promise.all([getSession(), getPayload({ config })])

  const result = await payload.find({
    collection: 'board-members',
    sort: 'order',
    limit: 100,
    depth: 1,
  })

  return (
    <ContentPageShell
      user={user}
      title="هیات امنا"
      description="اعضای هیات امنا و معرفی کوتاه هر یک."
    >
      {result.docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">هنوز عضوی ثبت نشده است.</p>
      ) : (
        <BoardMembersGrid members={result.docs} showTitle={false} />
      )}
    </ContentPageShell>
  )
}
