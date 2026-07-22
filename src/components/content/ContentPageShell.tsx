import type { Donor } from '@/payload-types'

import SiteHeader from '@/components/SiteHeader'

type ContentPageShellProps = {
  user?: Donor | null
  title: string
  description?: string | null
  children: React.ReactNode
}

export default function ContentPageShell({
  user,
  title,
  description,
  children,
}: ContentPageShellProps) {
  return (
    <>
      <SiteHeader user={user} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-black sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </header>
        {children}
      </main>
    </>
  )
}
