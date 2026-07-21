import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DonationsPaginationProps = {
  page: number
  totalPages: number
  basePath: string
}

export default function DonationsPagination({
  page,
  totalPages,
  basePath,
}: DonationsPaginationProps) {
  if (totalPages <= 1) return null

  const pageHref = (target: number) => (target <= 1 ? basePath : `${basePath}?page=${target}`)

  return (
    <nav
      aria-label="صفحه‌بندی پرداخت‌ها"
      className="mt-6 flex items-center justify-between gap-3"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          <ChevronRight className="h-4 w-4" />
          قبلی
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'pointer-events-none gap-1.5 opacity-50',
          )}
        >
          <ChevronRight className="h-4 w-4" />
          قبلی
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        صفحه {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
      </span>

      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          بعدی
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'pointer-events-none gap-1.5 opacity-50',
          )}
        >
          بعدی
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}
