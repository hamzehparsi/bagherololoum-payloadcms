import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, ImageIcon, Video } from 'lucide-react'

import type { GalleryMediaType } from '@/lib/content'
import { cn } from '@/lib/utils'

type GalleryCardProps = {
  href: string
  title: string
  description?: string | null
  date?: string | null
  mediaType?: GalleryMediaType
  imageUrl?: string | null
  imageAlt?: string
  className?: string
}

const mediaTypeMeta: Record<GalleryMediaType, { label: string; Icon: typeof ImageIcon }> = {
  photo: { label: 'گزارش تصویری', Icon: ImageIcon },
  video: { label: 'ویدیو', Icon: Video },
}

export default function GalleryCard({
  href,
  title,
  description,
  date,
  mediaType,
  imageUrl,
  imageAlt = '',
  className,
}: GalleryCardProps) {
  const typeMeta = mediaType ? mediaTypeMeta[mediaType] : null

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:border-border hover:shadow-[0_10px_24px_-12px_rgba(0,0,0,0.12)]',
        className,
      )}
    >
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

        {typeMeta && (
          <span
            dir="ltr"
            className="absolute top-3 left-3 inline-flex h-10 max-w-10 items-center overflow-hidden rounded-xl bg-brand-red text-white shadow-md transition-[max-width] duration-300 ease-out group-hover:max-w-[11rem]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center">
              <typeMeta.Icon className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="whitespace-nowrap pe-3 text-xs font-semibold opacity-0 transition-opacity duration-200 delay-75 group-hover:opacity-100">
              {typeMeta.label}
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-black leading-snug text-brand-green transition-colors duration-300 group-hover:text-brand-red">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-3.5">
          {date ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-brand-green/70" />
              {date}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red transition-transform duration-300 group-hover:-translate-x-0.5">
            مشاهده مطلب
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
