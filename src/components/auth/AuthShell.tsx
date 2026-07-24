'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'

type AuthShellProps = {
  children: React.ReactNode
  title: string
  description?: string
  backHref?: string
  backLabel?: string
}

export default function AuthShell({
  children,
  title,
  description,
  backHref,
  backLabel = 'بازگشت',
}: AuthShellProps) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-red/5 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -right-8 h-32 w-32 rounded-full bg-brand-green/5 blur-2xl" />

      <div className="relative mb-2 flex flex-col items-center text-center">
        <div className="flex justify-center">
          <Logo
            href="/"
            imageClassName="h-[9.33rem] max-w-[373px] sm:h-[10.67rem] sm:max-w-[140px]"
          />
        </div>
      </div>

      <div
        className={cn(
          'relative rounded-2xl border border-border bg-card p-6',
          'ring-1 ring-brand-green/10',
        )}
      >
        {children}
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        با ورود به سامانه، شرایط و قوانین استفاده را می‌پذیرید.
      </p>
    </div>
  )
}
