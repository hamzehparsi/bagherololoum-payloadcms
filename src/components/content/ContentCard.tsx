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
        'group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-emerald-500/10">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        {badge && (
          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug group-hover:text-primary">{title}</h3>
        {meta && <p className="mt-2 text-xs text-muted-foreground">{meta}</p>}
        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </Link>
  )
}
