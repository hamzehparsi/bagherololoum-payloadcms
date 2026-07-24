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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-border hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.12)]">
      {/* تصویر */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {occasion.imageUrl ? (
          <Image
            src={occasion.imageUrl}
            alt={occasion.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-red/10 via-muted to-brand-green/10">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}

        {occasion.isFixedAmount && occasion.fixedAmount != null && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-red shadow-sm backdrop-blur-sm">
            <Lock className="h-3 w-3" />
            {formatTomans(occasion.fixedAmount)}
          </span>
        )}

        {percent !== null && (
          <span className="absolute bottom-3 left-3 rounded-full bg-brand-green/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm">
            ٪{percent.toLocaleString('fa-IR')}
          </span>
        )}
      </div>

      {/* محتوا */}
      <div className="flex flex-1 flex-col p-5">
        {occasion.dateRangeLabel && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarRange className="h-3.5 w-3.5 shrink-0" />
            {occasion.dateRangeLabel}
          </p>
        )}
        <h3 className="text-base font-black">{occasion.title}</h3>

        {occasion.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {occasion.description}
          </p>
        )}

        <div className="mt-auto pt-5">
          {hasTarget ? (
            <div className="mb-4 space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand-red transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-brand-green">
                  {formatTomans(occasion.raised)} جمع شده
                </span>
                <span className="text-muted-foreground">
                  هدف: {formatTomans(occasion.targetAmount!)}
                </span>
              </div>
            </div>
          ) : occasion.raised > 0 ? (
            <p className="mb-4 text-xs font-medium text-brand-green">
              تاکنون {formatTomans(occasion.raised)} جمع شده است
            </p>
          ) : null}

          <Link
            href={`/donate?occasion=${occasion.id}`}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'lg' }),
              'w-full gap-1.5 rounded-full',
            )}
          >
            مشارکت در این مناسبت
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <Link
            href={`/occasions/${occasion.id}`}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'mt-2 w-full gap-1.5 rounded-full',
            )}
          >
            دانلود و چاپ QR
          </Link>
        </div>
      </div>
    </div>
  )
}
