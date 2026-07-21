import Link from 'next/link'
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
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -right-8 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl" />

      <div className="relative mb-6 flex flex-col items-center text-center">
        <Link href="/" className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-sm font-bold text-primary">
            ب
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-foreground">هیات باقرالعلوم (ع)</p>
            <p className="text-xs text-muted-foreground">سامانه پرداخت آنلاین</p>
          </div>
        </Link>

        {backHref && (
          <Link
            href={backHref}
            className="mb-4 self-start text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {backLabel}
          </Link>
        )}

        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div
        className={cn(
          'relative rounded-2xl border border-border bg-card p-6',
          'ring-1 ring-black/[0.02]',
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
