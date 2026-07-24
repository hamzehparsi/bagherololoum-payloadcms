import Link from 'next/link'

import { cn } from '@/lib/utils'
import { getPodcastHashtags, podcastTagHref, type PodcastHashtagItem } from '@/lib/podcast-filters'

type PodcastHashtagsProps = {
  hashtags?: PodcastHashtagItem[] | null
  className?: string
  size?: 'sm' | 'md'
}

export default function PodcastHashtags({
  hashtags,
  className,
  size = 'md',
}: PodcastHashtagsProps) {
  const items = getPodcastHashtags(hashtags)
  if (items.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <Link
          key={item.id || item.tag}
          href={podcastTagHref(item.tag)}
          className={cn(
            'rounded-full bg-brand-green/10 font-medium text-brand-green transition-colors hover:bg-brand-green/15',
            size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1 text-xs',
          )}
        >
          #{item.tag}
        </Link>
      ))}
    </div>
  )
}
