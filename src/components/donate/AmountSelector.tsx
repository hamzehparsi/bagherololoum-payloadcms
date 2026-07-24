'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { formatTomans, parseAmountInput } from '@/lib/format'

export type DonateOccasionOption = {
  id: number
  title: string
  description?: string | null
  isFixedAmount?: boolean | null
  fixedAmount?: number | null
}

type AmountSelectorProps = {
  fixedAmount?: number | null
  suggestedAmounts: number[]
  minAmount: number
  value: number | null
  onChange: (amount: number | null) => void
  disabled?: boolean
}

export default function AmountSelector({
  fixedAmount,
  suggestedAmounts,
  minAmount,
  value,
  onChange,
  disabled,
}: AmountSelectorProps) {
  const [customInput, setCustomInput] = useState('')

  useEffect(() => {
    if (value == null || suggestedAmounts.includes(value)) {
      setCustomInput('')
      return
    }

    setCustomInput(value.toLocaleString('fa-IR'))
  }, [value, suggestedAmounts])

  if (fixedAmount != null) {
    return (
      <div className="rounded-xl border border-brand-red/20 bg-brand-red/5 px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">مبلغ ثابت این مناسبت</p>
        <p className="mt-1 text-lg font-bold text-brand-red">{formatTomans(fixedAmount)}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {suggestedAmounts.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">مبالغ پیشنهادی</p>
          <div className="flex flex-wrap gap-2">
            {suggestedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                disabled={disabled}
                onClick={() => onChange(amount)}
                className={cn(
                  'rounded-xl border px-4 py-2.5 text-sm font-medium transition-all',
                  value === amount
                    ? 'border-brand-red bg-brand-red text-brand-red-foreground'
                    : 'border-border bg-background hover:border-brand-red/40 hover:bg-brand-red/5',
                )}
              >
                {formatTomans(amount)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          یا مبلغ دلخواه (حداقل {formatTomans(minAmount)})
        </p>
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          placeholder="مثلاً ۵۰۰٬۰۰۰"
          value={customInput}
          onChange={(e) => {
            const parsed = parseAmountInput(e.target.value)
            setCustomInput(parsed ? parsed.toLocaleString('fa-IR') : '')
            onChange(parsed)
          }}
          className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition-colors focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 disabled:opacity-50"
        />
      </div>
    </div>
  )
}
