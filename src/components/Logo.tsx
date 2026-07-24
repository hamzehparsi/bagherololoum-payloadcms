import Link from 'next/link'
import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

const adminImageStyle: CSSProperties = {
  display: 'block',
  height: '10rem',
  width: 'auto',
  maxWidth: '560px',
  objectFit: 'contain',
}

type LogoProps = {
  className?: string
  imageClassName?: string
  imageStyle?: CSSProperties
  href?: string
}

export default function Logo({ className, href, imageClassName, imageStyle }: LogoProps) {
  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="لوگو"
      className={cn(href ? 'w-auto object-contain' : 'object-contain', imageClassName)}
      style={href ? imageStyle : { ...adminImageStyle, ...imageStyle }}
    />
  )

  if (href) {
    return (
      <Link href={href} className={cn('inline-flex shrink-0', className)} aria-label="صفحه اصلی">
        {image}
      </Link>
    )
  }

  return <span className={cn('inline-flex shrink-0', className)}>{image}</span>
}
