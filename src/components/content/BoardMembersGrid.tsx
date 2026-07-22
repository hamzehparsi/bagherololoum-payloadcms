import Image from 'next/image'
import type { BoardMember } from '@/payload-types'

import { resolveMediaAlt, resolveMediaSizeUrl } from '@/lib/media'

type BoardMembersGridProps = {
  members: BoardMember[]
  showTitle?: boolean
}

export default function BoardMembersGrid({ members, showTitle = true }: BoardMembersGridProps) {
  if (members.length === 0) return null

  return (
    <section className={showTitle ? 'mt-12' : undefined}>
      {showTitle && <h2 className="mb-6 text-lg font-bold">هیات امنا</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const photoUrl = resolveMediaSizeUrl(member.photo, 'card')
          const alt = resolveMediaAlt(member.photo, member.name)

          return (
            <article
              key={member.id}
              className="overflow-hidden rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                  {photoUrl ? (
                    <Image src={photoUrl} alt={alt} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">{member.name}</h3>
                  {member.role && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{member.role}</p>
                  )}
                  {member.bio && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
