import Image from 'next/image'
import Link from 'next/link'
import { ImageIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type ContentCardProps = {
  href: string
  title: string
  description?: string | null
  meta?: string | null
  imageUrl?: string | null
  imageAlt?: string
  badge?: string | null
  className?: string
}

export default function ContentCard({
  href,
  title,
  description,
  meta,
  imageUrl,
  imageAlt = '',
  badge,
  className,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-border bg-card',
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
        {badge && (
          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {meta && <p className="mb-2 text-xs text-muted-foreground">{meta}</p>}
        <h3 className="text-base font-black leading-snug transition-colors duration-300 group-hover:text-brand-red">
          {title}
        </h3>
        {description && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
