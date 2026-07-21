import type { Donor } from '@/payload-types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/(frontend)/auth/actions/logout'
import { getDonorDisplayName } from '@/lib/profile'
import PendingPaymentsBell, { type PendingPaymentItem } from '@/components/PendingPaymentsBell'

type HeaderProps = {
  user: Donor
  pendingPayments?: PendingPaymentItem[]
}

export default function Header({ user, pendingPayments = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-base font-bold text-foreground">
          هیات باقرالعلوم (ع)
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <PendingPaymentsBell items={pendingPayments} />

          <Link href="/profile" className="text-sm font-semibold text-foreground">
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-foreground">
                {getDonorDisplayName(user)}
              </p>
              <p className="text-xs text-muted-foreground">{user.username}</p>
            </div>
          </Link>
          <Link href="/profile" className="text-sm font-semibold text-foreground">
            <div className="sm:hidden text-left">
              <p className="text-xs font-semibold text-foreground">{getDonorDisplayName(user)}</p>
              <p className="text-[11px] text-muted-foreground">{user.username}</p>
            </div>
          </Link>

          <form action={logout}>
            <Button variant="outline" size="sm" type="submit" className="text-xs">
              خروج
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
