import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, ImageIcon, Mic2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { podcastPerformerHref } from '@/lib/podcast-filters'

type PodcastCardProps = {
  href: string
  title: string
  description?: string | null
  meta?: string | null
  performer?: string | null
  date?: string | null
  imageUrl?: string | null
  imageAlt?: string
  badge?: string | null
  className?: string
}

export default function PodcastCard({
  href,
  title,
  description,
  meta,
  performer,
  date,
  imageUrl,
  imageAlt = '',
  badge,
  className,
}: PodcastCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:border-border hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.12)]',
        className,
      )}
    >
      <Link href={href} className="group flex flex-1 flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-red/10 via-muted to-brand-green/10">
              <ImageIcon className="h-10 w-10 text-muted-foreground/40 transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {badge && (
            <span className="absolute top-3 right-3 rounded-full bg-brand-red px-2.5 py-1 text-[11px] font-medium text-white">
              {badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          {meta && <p className="mb-2 text-xs text-muted-foreground">{meta}</p>}
          <h3 className="text-base font-black leading-snug text-brand-green transition-colors duration-300 group-hover:text-brand-red">
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
      </Link>

      {(performer || date) && (
        <div className="flex items-center justify-between gap-3 border-t border-border/60 px-5 pb-5 pt-3">
          {performer ? (
            <Link
              href={podcastPerformerHref(performer)}
              className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-brand-red/8 px-2.5 py-1.5 text-xs font-semibold text-brand-red transition-colors hover:bg-brand-red/15"
            >
              <Mic2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{performer}</span>
            </Link>
          ) : (
            <span />
          )}
          {date && (
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-brand-green/70" />
              {date}
            </span>
          )}
        </div>
      )}
    </article>
  )
}
