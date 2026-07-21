'use client'

import { useMemo, useState, useTransition } from 'react'
import { Heart, Sparkles, Building2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatTomans } from '@/lib/format'
import AmountSelector, { type DonateOccasionOption } from '@/components/donate/AmountSelector'
import { prepareDonation } from '@/app/(frontend)/donate/actions/prepare-donation'
import {
  GENERAL_DONATION_DESCRIPTION,
  GENERAL_DONATION_TITLE,
  type DonationTarget,
} from '@/lib/payment-amounts'

type DonateFormProps = {
  occasions: DonateOccasionOption[]
  globalSuggestedAmounts: number[]
  minCustomAmount: number
  isLoggedIn: boolean
  initialTarget?: DonationTarget | null
}

export default function DonateForm({
  occasions,
  globalSuggestedAmounts,
  minCustomAmount,
  isLoggedIn,
  initialTarget = null,
}: DonateFormProps) {
  const [selectedTarget, setSelectedTarget] = useState<DonationTarget | null>(initialTarget)
  const [amount, setAmount] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  const selectedOccasion = useMemo(() => {
    if (selectedTarget === null || selectedTarget === 'general') return null
    return occasions.find((item) => item.id === selectedTarget) ?? null
  }, [occasions, selectedTarget])

  const selectedLabel = useMemo(() => {
    if (selectedTarget === 'general') return GENERAL_DONATION_TITLE
    if (selectedOccasion) return selectedOccasion.title
    return null
  }, [selectedTarget, selectedOccasion])

  const suggestedAmounts = useMemo(() => {
    if (!selectedTarget) return []
    if (selectedOccasion?.isFixedAmount) return []
    return globalSuggestedAmounts
  }, [selectedTarget, selectedOccasion, globalSuggestedAmounts])

  const effectiveAmount = useMemo(() => {
    if (selectedOccasion?.isFixedAmount && selectedOccasion.fixedAmount != null) {
      return selectedOccasion.fixedAmount
    }
    return amount
  }, [selectedOccasion, amount])

  const handleTargetSelect = (target: DonationTarget) => {
    setSelectedTarget(target)
    setAmount(null)
  }

  const handleSubmit = () => {
    if (!selectedTarget) {
      toast.error('لطفاً موضوع کمک خود را انتخاب کنید')
      return
    }

    if (!effectiveAmount) {
      toast.error('لطفاً مبلغ را انتخاب یا وارد کنید')
      return
    }

    const occasionId = selectedTarget === 'general' ? null : selectedTarget

    startTransition(async () => {
      const result = await prepareDonation(occasionId, effectiveAmount)

      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">مشارکت در کمک مالی</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoggedIn
                ? 'ابتدا موضوع کمک را انتخاب کنید، سپس مبلغ را مشخص کنید.'
                : 'موضوع و مبلغ را انتخاب کنید؛ قبل از پرداخت وارد حساب می‌شوید.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">موضوع کمک</p>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => handleTargetSelect('general')}
            className={cn(
              'rounded-2xl border p-4 text-right transition-all',
              selectedTarget === 'general'
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-border bg-card hover:border-primary/30',
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{GENERAL_DONATION_TITLE}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {GENERAL_DONATION_DESCRIPTION}
                </p>
              </div>
            </div>
          </button>

          {occasions.map((occasion) => {
            const selected = selectedTarget === occasion.id
            return (
              <button
                key={occasion.id}
                type="button"
                onClick={() => handleTargetSelect(occasion.id)}
                className={cn(
                  'rounded-2xl border p-4 text-right transition-all',
                  selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border bg-card hover:border-primary/30',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{occasion.title}</p>
                    {occasion.description && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {occasion.description}
                      </p>
                    )}
                  </div>
                  {occasion.isFixedAmount && occasion.fixedAmount != null && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {formatTomans(occasion.fixedAmount)}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">مبلغ پرداخت</p>
        {!selectedTarget ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            برای انتخاب مبلغ، ابتدا موضوع کمک را مشخص کنید.
          </div>
        ) : (
          <AmountSelector
            fixedAmount={selectedOccasion?.isFixedAmount ? selectedOccasion.fixedAmount : null}
            suggestedAmounts={suggestedAmounts}
            minAmount={minCustomAmount}
            value={effectiveAmount}
            onChange={setAmount}
            disabled={pending}
          />
        )}
      </div>

      <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">مبلغ نهایی</span>
          <span className="text-base font-bold text-foreground">
            {effectiveAmount ? formatTomans(effectiveAmount) : '—'}
          </span>
        </div>
        {selectedLabel && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>موضوع کمک</span>
            <span>{selectedLabel}</span>
          </div>
        )}
      </div>

      <Button
        className="h-12 w-full text-sm font-semibold"
        disabled={pending || !selectedTarget || !effectiveAmount}
        onClick={handleSubmit}
      >
        {pending ? 'در حال انتقال...' : 'تأیید و ادامه'}
      </Button>
    </div>
  )
}
