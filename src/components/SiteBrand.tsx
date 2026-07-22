import Image from 'next/image'
import Link from 'next/link'

type SiteBrandProps = {
  siteName: string
  logoUrl?: string | null
  className?: string
}

export default function SiteBrand({ siteName, logoUrl, className }: SiteBrandProps) {
  return (
    <Link href="/" className={className ?? 'flex shrink-0 items-center gap-2 text-foreground'}>
      {logoUrl ? (
        <span className="relative h-12 w-12 shrink-0 overflow-hidden">
          <Image src={logoUrl} alt={siteName} fill sizes="36px" className="object-contain p-0.5" />
        </span>
      ) : null}
      <span className="truncate text-base font-black sm:text-lg">{siteName}</span>
    </Link>
  )
}
