import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarRange, ImageIcon, Lock } from 'lucide-react'

import { formatTomans } from '@/lib/format'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type OccasionCardData = {
  id: number
  title: string
  description?: string | null
  isFixedAmount?: boolean | null
  fixedAmount?: number | null
  targetAmount?: number | null
  raised: number
  imageUrl?: string | null
  dateRangeLabel?: string | null
}

type OccasionCardProps = {
  occasion: OccasionCardData
}

export default function OccasionCard({ occasion }: OccasionCardProps) {
  const hasTarget = typeof occasion.targetAmount === 'number' && occasion.targetAmount > 0
  const percent = hasTarget
    ? Math.min(100, Math.round((occasion.raised / occasion.targetAmount!) * 100))
    : null

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* تصویر */}
      <div className="relative h-44 w-full bg-muted">
        {occasion.imageUrl ? (
          <Image
            src={occasion.imageUrl}
            alt={occasion.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-emerald-500/10">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        {occasion.isFixedAmount && occasion.fixedAmount != null && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
            <Lock className="h-3 w-3" />
            {formatTomans(occasion.fixedAmount)}
          </span>
        )}

        {percent !== null && (
          <span className="absolute bottom-3 left-3 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
            ٪{percent.toLocaleString('fa-IR')}
          </span>
        )}
      </div>

      {/* محتوا */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold">{occasion.title}</h3>

        {occasion.dateRangeLabel && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarRange className="h-3.5 w-3.5 shrink-0" />
            {occasion.dateRangeLabel}
          </p>
        )}

        {occasion.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {occasion.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          {hasTarget ? (
            <div className="mb-4 space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-600">
                  {formatTomans(occasion.raised)} جمع شده
                </span>
                <span className="text-muted-foreground">
                  هدف: {formatTomans(occasion.targetAmount!)}
                </span>
              </div>
            </div>
          ) : occasion.raised > 0 ? (
            <p className="mb-4 text-xs font-medium text-emerald-600">
              تاکنون {formatTomans(occasion.raised)} جمع شده است
            </p>
          ) : null}

          <Link
            href={`/donate?occasion=${occasion.id}`}
            className={cn(buttonVariants({ size: 'sm' }), 'w-full gap-1.5')}
          >
            مشارکت در این مناسبت
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
