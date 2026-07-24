import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type SectionHeaderProps = {
  title: string
  href?: string
  linkLabel?: string
}

export default function SectionHeader({
  title,
  href,
  linkLabel = 'مشاهده همه',
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <h2 className="text-lg font-black">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-brand-red hover:underline"
        >
          {linkLabel}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
