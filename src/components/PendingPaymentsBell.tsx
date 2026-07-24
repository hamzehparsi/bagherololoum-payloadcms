'use client'

import Link from 'next/link'
import { Bell, ChevronLeft, Clock } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type PendingPaymentItem = {
  id: number
  amountLabel: string
  occasionTitle: string
  createdAtLabel: string
}

type PendingPaymentsBellProps = {
  items: PendingPaymentItem[]
}

export default function PendingPaymentsBell({ items }: PendingPaymentsBellProps) {
  const count = items.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-green/15 bg-brand-green/[0.04] text-brand-green transition-all hover:border-brand-green/30 hover:bg-brand-green/[0.08] hover:text-brand-green"
        aria-label="پرداخت‌های در انتظار"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-card">
            {count > 9 ? '۹+' : count.toLocaleString('fa-IR')}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]" dir="rtl">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {count > 0 ? `${count.toLocaleString('fa-IR')} پرداخت در انتظار` : 'اعلان‌ها'}
        </div>
        <DropdownMenuSeparator />

        {count === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            پرداختِ در انتظاری ندارید.
          </p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              render={<Link href={`/donate/payment?id=${item.id}`} />}
              className="cursor-pointer px-2 py-2"
            >
              <div className="flex w-full items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Clock className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{item.amountLabel}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {item.occasionTitle} · {item.createdAtLabel}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-brand-red">
                  ادامه پرداخت
                  <ChevronLeft className="h-3.5 w-3.5" />
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href="/profile/donations" />}
          className="cursor-pointer justify-center px-2 py-1.5 text-xs text-muted-foreground"
        >
          مشاهده همه پرداخت‌ها
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
